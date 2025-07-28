import {
  createWebhookSubscriptionBlock,
  withoutHistoryItems,
} from "../utils/webhookHandlers.ts";
import { ClickUpWebhookEvent } from "../types.ts";
import outputSchema from "./schemas/taskEventSchema.json" with { type: "json" };

function buildTaskEventPayload(payload: ClickUpWebhookEvent) {
  const result: any = { taskId: payload.task_id };

  if (payload.history_items) {
    result.historyItems = payload.history_items;
  }

  // Special case for taskTimeTrackedUpdated - include data property
  if (payload.data) {
    result.data = payload.data;
  }

  return result;
}

export const taskCreatedSubscription = createWebhookSubscriptionBlock(
  "Task Created",
  "Receives events when a new task is created in ClickUp",
  "taskCreated",
  buildTaskEventPayload,
  outputSchema,
);

export const taskUpdatedSubscription = createWebhookSubscriptionBlock(
  "Task Updated",
  "Receives events when a task is updated in ClickUp",
  "taskUpdated",
  buildTaskEventPayload,
  outputSchema,
);

export const taskDeletedSubscription = createWebhookSubscriptionBlock(
  "Task Deleted",
  "Receives events when a task is deleted in ClickUp",
  "taskDeleted",
  buildTaskEventPayload,
  withoutHistoryItems(outputSchema),
);

export const taskPriorityUpdatedSubscription = createWebhookSubscriptionBlock(
  "Task Priority Updated",
  "Receives events when a task priority is updated in ClickUp",
  "taskPriorityUpdated",
  buildTaskEventPayload,
  outputSchema,
);

export const taskStatusUpdatedSubscription = createWebhookSubscriptionBlock(
  "Task Status Updated",
  "Receives events when a task status is updated in ClickUp",
  "taskStatusUpdated",
  buildTaskEventPayload,
  outputSchema,
);

export const taskAssigneeUpdatedSubscription = createWebhookSubscriptionBlock(
  "Task Assignee Updated",
  "Receives events when a task assignee is updated in ClickUp",
  "taskAssigneeUpdated",
  buildTaskEventPayload,
  outputSchema,
);

export const taskDueDateUpdatedSubscription = createWebhookSubscriptionBlock(
  "Task Due Date Updated",
  "Receives events when a task due date is updated in ClickUp",
  "taskDueDateUpdated",
  buildTaskEventPayload,
  outputSchema,
);

export const taskTagUpdatedSubscription = createWebhookSubscriptionBlock(
  "Task Tag Updated",
  "Receives events when a task tag is updated in ClickUp",
  "taskTagUpdated",
  buildTaskEventPayload,
  outputSchema,
);

export const taskMovedSubscription = createWebhookSubscriptionBlock(
  "Task Moved",
  "Receives events when a task is moved in ClickUp",
  "taskMoved",
  buildTaskEventPayload,
  outputSchema,
);

export const taskCommentPostedSubscription = createWebhookSubscriptionBlock(
  "Task Comment Posted",
  "Receives events when a comment is posted on a task in ClickUp",
  "taskCommentPosted",
  buildTaskEventPayload,
  outputSchema,
);

export const taskCommentUpdatedSubscription = createWebhookSubscriptionBlock(
  "Task Comment Updated",
  "Receives events when a task comment is updated in ClickUp",
  "taskCommentUpdated",
  buildTaskEventPayload,
  outputSchema,
);

export const taskTimeEstimateUpdatedSubscription =
  createWebhookSubscriptionBlock(
    "Task Time Estimate Updated",
    "Receives events when a task time estimate is updated in ClickUp",
    "taskTimeEstimateUpdated",
    buildTaskEventPayload,
    outputSchema,
  );

export const taskTimeTrackedUpdatedSubscription =
  createWebhookSubscriptionBlock(
    "Task Time Tracked Updated",
    "Receives events when task time tracking is updated in ClickUp",
    "taskTimeTrackedUpdated",
    buildTaskEventPayload,
    {
      ...outputSchema,
      properties: {
        ...outputSchema.properties,
        data: {
          type: "object",
          description: "Time tracking data",
          properties: {
            description: { type: "string" },
            interval_id: { type: "string" },
          },
          required: ["description", "interval_id"],
        },
      },
      required: [...outputSchema.required, "data"],
    },
  );
