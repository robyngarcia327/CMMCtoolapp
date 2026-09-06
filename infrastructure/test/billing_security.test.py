from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[2]
LAMBDA = ROOT / "lambda"


class BillingSecurityContractTests(unittest.TestCase):
    def source(self, name: str) -> str:
        return (LAMBDA / name).read_text(encoding="utf-8")

    def test_authenticated_handlers_enforce_membership(self):
        handlers = [
            "billing_checkout.py",
            "billing_portal.py",
            "billing_cancel.py",
            "billing_resume.py",
            "billing_change_plan.py",
            "billing_status.py",
            "billing_usage.py",
        ]
        for handler in handlers:
            with self.subTest(handler=handler):
                source = self.source(handler)
                self.assertIn("member(", source)
                self.assertIn("user_sub(event)", source)

    def test_billing_handlers_do_not_scan_tenant_table(self):
        for handler in LAMBDA.glob("billing_*.py"):
            with self.subTest(handler=handler.name):
                self.assertNotIn("tenant_table.scan", handler.read_text(encoding="utf-8"))

    def test_tenant_lookup_uses_org_and_subscription_indexes(self):
        source = self.source("common/utils.py")
        self.assertIn("IndexName=ORG_INDEX", source)
        self.assertIn("IndexName=SUB_INDEX", source)

    def test_checkout_metadata_excludes_names_and_email(self):
        source = self.source("billing_checkout.py")
        self.assertNotIn("'orgName'", source)
        self.assertNotIn("'email':", source)

    def test_webhook_verifies_signature_and_deduplicates_events(self):
        source = self.source("billing_webhook.py")
        self.assertIn("stripe.Webhook.construct_event", source)
        self.assertIn("ConditionExpression='attribute_not_exists(eventId)'", source)
        self.assertIn("'duplicate':True", source)


if __name__ == "__main__":
    unittest.main()
