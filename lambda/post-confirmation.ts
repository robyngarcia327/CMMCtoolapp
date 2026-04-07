/**
 * AWS Lambda: Cognito Post-Confirmation Trigger
 * 
 * Purpose:
 * - Confirms the user in Cognito.
 * - Optionally creates a lightweight pending-user record.
 * - DOES NOT auto-create the organization or grant paid access.
 * - Paid access is now handled by the Stripe Webhook.
 */

import { PostConfirmationTriggerEvent, Context, Callback } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE!;

export const handler = async (
  event: PostConfirmationTriggerEvent,
  context: Context,
  callback: Callback
): Promise<any> => {
  console.log("PostConfirmation Triggered:", JSON.stringify(event, null, 2));

  const { sub, email, name } = event.request.userAttributes;

  try {
    // Optionally create a lightweight user record
    // This helps track users who have signed up but haven't paid yet
    await ddbDocClient.send(new PutCommand({
      TableName: USERS_TABLE,
      Item: {
        userId: sub,
        email: email,
        name: name || email.split('@')[0],
        status: 'PENDING_PAYMENT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }));

    console.log(`User record created for ${email} (${sub})`);
    
    // Return the event to Cognito to complete the confirmation
    return event;
  } catch (error) {
    console.error("Error in PostConfirmation:", error);
    // Even if DB write fails, we should probably return the event so the user isn't blocked from logging in
    // but they won't have an org yet anyway.
    return event;
  }
};
