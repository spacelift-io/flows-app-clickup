import { createWebhookSubscriptionBlock } from "../utils/webhookHandlers.ts";
import { ClickUpWebhookEvent } from "../types.ts";
import outputSchema from "./schemas/keyResultEventSchema.json" with { type: "json" };

function buildKeyResultEventPayload(payload: ClickUpWebhookEvent) {
  return {
    goalId: payload.goal_id,
    keyResultId: payload.key_result_id,
  };
}

export const keyResultCreatedSubscription = createWebhookSubscriptionBlock(
  "Key Result Created",
  "Receives events when a new key result is created in ClickUp",
  "keyResultCreated",
  buildKeyResultEventPayload,
  outputSchema,
);

export const keyResultDeletedSubscription = createWebhookSubscriptionBlock(
  "Key Result Deleted",
  "Receives events when a key result is deleted in ClickUp",
  "keyResultDeleted",
  buildKeyResultEventPayload,
  outputSchema,
);

export const keyResultUpdatedSubscription = createWebhookSubscriptionBlock(
  "Key Result Updated",
  "Receives events when a key result is updated in ClickUp",
  "keyResultUpdated",
  buildKeyResultEventPayload,
  outputSchema,
);
