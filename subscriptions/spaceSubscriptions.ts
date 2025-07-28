import { createWebhookSubscriptionBlock } from "../utils/webhookHandlers.ts";
import { ClickUpWebhookEvent } from "../types.ts";
import outputSchema from "./schemas/spaceEventSchema.json" with { type: "json" };

function buildSpaceEventPayload(payload: ClickUpWebhookEvent) {
  return { spaceId: payload.space_id };
}

export const spaceCreatedSubscription = createWebhookSubscriptionBlock(
  "Space Created",
  "Receives events when a new space is created in ClickUp",
  "spaceCreated",
  buildSpaceEventPayload,
  outputSchema,
);

export const spaceDeletedSubscription = createWebhookSubscriptionBlock(
  "Space Deleted",
  "Receives events when a space is deleted in ClickUp",
  "spaceDeleted",
  buildSpaceEventPayload,
  outputSchema,
);

export const spaceUpdatedSubscription = createWebhookSubscriptionBlock(
  "Space Updated",
  "Receives events when a space is updated in ClickUp",
  "spaceUpdated",
  buildSpaceEventPayload,
  outputSchema,
);
