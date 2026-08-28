import stripe

from common.utils import body, member, now_iso, response, tenant_for_org, tenants, user_sub
from common.stripe_utils import client, plan, stripe_error


PLAN_RANK = {"starter": 1, "professional": 2, "guided": 3}


def _stripe_dict(value):
    return value.to_dict_recursive() if hasattr(value, "to_dict_recursive") else value


def _price_for(plan_code, interval):
    if plan_code == "msp":
        raise ValueError("MSP conversions are sales-assisted")
    if plan_code not in PLAN_RANK:
        raise ValueError("planCode must be starter, professional, or guided")
    if interval not in {"month", "year"}:
        raise ValueError("interval must be month or year")
    price_id = (plan(plan_code).get("prices") or {}).get(interval)
    if not price_id:
        raise ValueError("The selected plan and interval are not configured")
    return price_id


def _items(subscription):
    return ((_stripe_dict(subscription).get("items") or {}).get("data") or [])


def _schedule_downgrade(stripe_client, subscription, item, target_price, plan_code, interval, org_id):
    sub = _stripe_dict(subscription)
    schedule_ref = sub.get("schedule")
    schedule_id = schedule_ref.get("id") if isinstance(schedule_ref, dict) else schedule_ref
    if not schedule_id:
        schedule = stripe_client.v1.subscription_schedules.create(
            params={"from_subscription": sub["id"]},
            options={"idempotency_key": f"change-plan-schedule:{sub['id']}:{sub.get('current_period_end')}"},
        )
        schedule_id = _stripe_dict(schedule)["id"]

    current_items = []
    for current in _items(subscription):
        current_items.append({
            "price": (current.get("price") or {}).get("id"),
            "quantity": int(current.get("quantity") or 1),
        })

    period_start = int(sub.get("current_period_start") or 0)
    period_end = int(sub.get("current_period_end") or 0)
    if not period_start or not period_end:
        raise RuntimeError("Stripe subscription period is missing")

    stripe_client.v1.subscription_schedules.update(
        schedule_id,
        params={
            "end_behavior": "release",
            "phases": [
                {
                    "start_date": period_start,
                    "end_date": period_end,
                    "items": current_items,
                    "proration_behavior": "none",
                },
                {
                    "start_date": period_end,
                    "iterations": 1,
                    "items": [{"price": target_price, "quantity": 1}],
                    "metadata": {"orgId": org_id, "planCode": plan_code, "interval": interval},
                    "proration_behavior": "none",
                },
            ],
        },
        options={"idempotency_key": f"change-plan:{sub['id']}:{plan_code}:{interval}:{period_end}"},
    )
    return period_end, schedule_id


def lambda_handler(event, context):
    try:
        request = body(event)
        org_id = (request.get("orgId") or "").strip()
        plan_code = (request.get("planCode") or "").strip().lower()
        interval = (request.get("interval") or "month").strip().lower()
        if not org_id:
            raise ValueError("orgId is required")

        member(org_id, user_sub(event), {"owner", "admin"})
        tenant = tenant_for_org(org_id)
        if not tenant or not tenant.get("stripeSubscriptionId"):
            return response(404, {"error": "No Stripe subscription is linked to this organization"})

        current_plan = (tenant.get("planCode") or "").lower()
        if current_plan not in PLAN_RANK:
            raise ValueError("The current subscription is not eligible for self-service plan changes")

        target_price = _price_for(plan_code, interval)
        stripe_client = client()
        subscription = stripe_client.v1.subscriptions.retrieve(tenant["stripeSubscriptionId"])
        sub = _stripe_dict(subscription)
        items = _items(subscription)
        if len(items) != 1:
            raise ValueError("This subscription requires billing assistance")

        item = items[0]
        current_price = (item.get("price") or {}).get("id")
        current_interval = ((item.get("price") or {}).get("recurring") or {}).get("interval")
        if current_price == target_price:
            return response(200, {
                "status": "unchanged",
                "planCode": current_plan,
                "interval": current_interval,
                "subscriptionId": sub["id"],
            })

        is_upgrade = PLAN_RANK[plan_code] > PLAN_RANK[current_plan] and current_interval == interval
        if is_upgrade:
            stripe_client.v1.subscriptions.update(
                sub["id"],
                params={
                    "items": [{"id": item["id"], "price": target_price, "quantity": 1}],
                    "proration_behavior": "always_invoice",
                    "metadata": {"orgId": org_id, "planCode": plan_code, "interval": interval},
                },
                options={"idempotency_key": f"change-plan:{sub['id']}:{plan_code}:{interval}:{sub.get('current_period_end')}"},
            )
            tenants.update_item(
                Key={"tenantId": tenant["tenantId"]},
                UpdateExpression="SET pendingPlanCode=:p,pendingPlanEffectiveAt=:e,updatedAt=:u",
                ExpressionAttributeValues={":p": plan_code, ":e": "immediate", ":u": now_iso()},
            )
            return response(200, {
                "status": "changing",
                "changeType": "immediate_upgrade",
                "currentPlanCode": current_plan,
                "requestedPlanCode": plan_code,
                "subscriptionId": sub["id"],
            })

        effective_at, schedule_id = _schedule_downgrade(
            stripe_client, subscription, item, target_price, plan_code, interval, org_id
        )
        tenants.update_item(
            Key={"tenantId": tenant["tenantId"]},
            UpdateExpression="SET pendingPlanCode=:p,pendingPlanEffectiveAt=:e,stripeScheduleId=:s,updatedAt=:u",
            ExpressionAttributeValues={":p": plan_code, ":e": effective_at, ":s": schedule_id, ":u": now_iso()},
        )
        return response(200, {
            "status": "scheduled",
            "changeType": "renewal_change",
            "currentPlanCode": current_plan,
            "requestedPlanCode": plan_code,
            "effectiveAt": effective_at,
            "subscriptionId": sub["id"],
            "scheduleId": schedule_id,
        })

    except ValueError as error:
        return response(400, {"error": str(error)})
    except PermissionError as error:
        return response(403, {"error": str(error)})
    except stripe.StripeError as error:
        print("billing_change_plan stripe", repr(error))
        return response(502, {"error": stripe_error(error)})
    except Exception as error:
        print("billing_change_plan", repr(error))
        return response(500, {"error": "Internal error"})
