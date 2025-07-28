import { createWebhookSubscriptionBlock } from "../utils/webhookHandlers.ts";
import { ClickUpWebhookEvent } from "../types.ts";
import outputSchema from "./schemas/goalEventSchema.json" with { type: "json" };

function buildGoalEventPayload(payload: ClickUpWebhookEvent) {
  return { goalId: payload.goal_id };
}

export const goalCreatedSubscription = createWebhookSubscriptionBlock(
  "Goal Created",
  "Receives events when a new goal is created in ClickUp",
  "goalCreated",
  buildGoalEventPayload,
  outputSchema,
);

export const goalDeletedSubscription = createWebhookSubscriptionBlock(
  "Goal Deleted",
  "Receives events when a goal is deleted in ClickUp",
  "goalDeleted",
  buildGoalEventPayload,
  outputSchema,
);

export const goalUpdatedSubscription = createWebhookSubscriptionBlock(
  "Goal Updated",
  "Receives events when a goal is updated in ClickUp",
  "goalUpdated",
  buildGoalEventPayload,
  outputSchema,
);
