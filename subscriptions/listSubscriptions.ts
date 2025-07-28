import {
  createWebhookSubscriptionBlock,
  withoutHistoryItems,
} from "../utils/webhookHandlers.ts";
import { ClickUpWebhookEvent } from "../types.ts";
import outputSchema from "./schemas/listEventSchema.json" with { type: "json" };

function buildListEventPayload(payload: ClickUpWebhookEvent) {
  const result: any = { listId: payload.list_id };

  if (payload.history_items) {
    result.historyItems = payload.history_items;
  }
  return result;
}

export const listCreatedSubscription = createWebhookSubscriptionBlock(
  "List Created",
  "Receives events when a new list is created in ClickUp",
  "listCreated",
  buildListEventPayload,
  withoutHistoryItems(outputSchema),
);

export const listUpdatedSubscription = createWebhookSubscriptionBlock(
  "List Updated",
  "Receives events when a list is updated in ClickUp",
  "listUpdated",
  buildListEventPayload,
  outputSchema,
);

export const listDeletedSubscription = createWebhookSubscriptionBlock(
  "List Deleted",
  "Receives events when a list is deleted in ClickUp",
  "listDeleted",
  buildListEventPayload,
  withoutHistoryItems(outputSchema),
);
