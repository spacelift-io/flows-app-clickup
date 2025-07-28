import { AppBlock, events } from "@slflows/sdk/v1";
import { ClickUpWebhookEvent, ClickUpWebhookEventType } from "../types.ts";

/**
 * Common webhook event base properties extracted from payload
 */
interface WebhookEventBase {
  event: string;
  webhookId: string;
}

/**
 * Extracts common webhook payload from internal message
 */
function extractWebhookPayload(message: any): ClickUpWebhookEvent {
  const { payload } = message.body as {
    headers: Record<string, string>;
    payload: ClickUpWebhookEvent;
  };
  return payload;
}

/**
 * Creates the base event properties from webhook payload
 */
function createEventBase(payload: ClickUpWebhookEvent): WebhookEventBase {
  return {
    event: payload.event,
    webhookId: payload.webhook_id,
  };
}

/**
 * Creates a webhook handler function with common boilerplate
 */
function createWebhookHandler<T>(
  expectedEvent: string,
  dataTransformer: (payload: ClickUpWebhookEvent) => T,
) {
  return async ({ message }: any) => {
    const payload = extractWebhookPayload(message);

    if (payload.event !== expectedEvent) {
      return;
    }

    await events.emit({
      ...createEventBase(payload),
      ...dataTransformer(payload),
    });
  };
}

/**
 * Creates a standard AppBlock for webhook subscription with common structure
 */
export function createWebhookSubscriptionBlock(
  name: string,
  description: string,
  expectedEvent: string,
  dataTransformer: (payload: ClickUpWebhookEvent) => any,
  eventSchema: any,
): AppBlock {
  return {
    name,
    description,
    category: "Event Subscriptions",
    outputs: {
      event: {
        name: `${name} Event`,
        description: `Emitted when ${description.toLowerCase()}`,
        default: true,
        type: eventSchema,
      },
    },
    onInternalMessage: createWebhookHandler(expectedEvent, dataTransformer),
  };
}

/**
 * Removes historyItems from a schema for events that don't include history
 */
export function withoutHistoryItems(schema: any) {
  const { historyItems, ...properties } = schema.properties;
  const required =
    schema.required?.filter((field: string) => field !== "historyItems") || [];
  return { ...schema, properties, required };
}

// List of supported event types
const SUPPORTED_EVENTS: ClickUpWebhookEventType[] = [
  "taskCreated",
  "taskUpdated",
  "taskDeleted",
  "taskCommentPosted",
  "taskCommentUpdated",
  "taskTimeTrackedUpdated",
  "listCreated",
  "listUpdated",
  "listDeleted",
  "folderCreated",
  "folderUpdated",
  "folderDeleted",
  "spaceCreated",
  "spaceUpdated",
  "spaceDeleted",
  "goalCreated",
  "goalUpdated",
  "goalDeleted",
  "taskPriorityUpdated",
  "taskStatusUpdated",
  "taskAssigneeUpdated",
  "taskDueDateUpdated",
  "taskTagUpdated",
  "taskMoved",
  "taskTimeEstimateUpdated",
  "keyResultCreated",
  "keyResultUpdated",
  "keyResultDeleted",
];

// Simple validation function for webhook payloads
export function isValidWebhookPayload(
  payload: unknown,
): payload is ClickUpWebhookEvent {
  return !!(
    payload &&
    typeof payload === "object" &&
    "event" in payload &&
    "webhook_id" in payload
  );
}

// Check if event type is supported
export function isSupportedEventType(
  eventType: string,
): eventType is ClickUpWebhookEventType {
  return SUPPORTED_EVENTS.includes(eventType as ClickUpWebhookEventType);
}
