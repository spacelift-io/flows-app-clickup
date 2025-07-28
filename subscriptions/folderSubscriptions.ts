import { createWebhookSubscriptionBlock } from "../utils/webhookHandlers.ts";
import { ClickUpWebhookEvent } from "../types.ts";
import outputSchema from "./schemas/folderEventSchema.json" with { type: "json" };

function buildFolderEventPayload(payload: ClickUpWebhookEvent) {
  return { folderId: payload.folder_id };
}

export const folderCreatedSubscription = createWebhookSubscriptionBlock(
  "Folder Created",
  "Receives events when a new folder is created in ClickUp",
  "folderCreated",
  buildFolderEventPayload,
  outputSchema,
);

export const folderDeletedSubscription = createWebhookSubscriptionBlock(
  "Folder Deleted",
  "Receives events when a folder is deleted in ClickUp",
  "folderDeleted",
  buildFolderEventPayload,
  outputSchema,
);

export const folderUpdatedSubscription = createWebhookSubscriptionBlock(
  "Folder Updated",
  "Receives events when a folder is updated in ClickUp",
  "folderUpdated",
  buildFolderEventPayload,
  outputSchema,
);
