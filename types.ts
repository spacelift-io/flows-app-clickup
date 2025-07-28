// ===============================
// COMPREHENSIVE CLICKUP TYPES
// ===============================

// Webhook event types - complete list from API
export type ClickUpWebhookEventType =
  // Task events
  | "taskCreated"
  | "taskUpdated"
  | "taskDeleted"
  | "taskPriorityUpdated"
  | "taskStatusUpdated"
  | "taskAssigneeUpdated"
  | "taskDueDateUpdated"
  | "taskTagUpdated"
  | "taskMoved"
  | "taskCommentPosted"
  | "taskCommentUpdated"
  | "taskTimeEstimateUpdated"
  | "taskTimeTrackedUpdated"
  // List events
  | "listCreated"
  | "listUpdated"
  | "listDeleted"
  // Folder events
  | "folderCreated"
  | "folderUpdated"
  | "folderDeleted"
  // Space events
  | "spaceCreated"
  | "spaceUpdated"
  | "spaceDeleted"
  // Goal events
  | "goalCreated"
  | "goalUpdated"
  | "goalDeleted"
  // Key result events
  | "keyResultCreated"
  | "keyResultUpdated"
  | "keyResultDeleted";

export interface ClickUpWebhookEvent {
  event: ClickUpWebhookEventType; // ClickUp sends event type here
  webhook_id: string;
  task_id?: string;
  list_id?: string;
  space_id?: string;
  folder_id?: string;
  team_id?: string;
  user_id?: string;
  goal_id?: string;
  key_result_id?: string;
  data?: Record<string, any>;
  history_items?: any[]; // For status change events
}
