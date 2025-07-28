// Import all event subscription blocks
import {
  taskCreatedSubscription,
  taskUpdatedSubscription,
  taskDeletedSubscription,
  taskPriorityUpdatedSubscription,
  taskStatusUpdatedSubscription,
  taskAssigneeUpdatedSubscription,
  taskDueDateUpdatedSubscription,
  taskTagUpdatedSubscription,
  taskMovedSubscription,
  taskCommentPostedSubscription,
  taskCommentUpdatedSubscription,
  taskTimeEstimateUpdatedSubscription,
  taskTimeTrackedUpdatedSubscription,
} from "./taskSubscriptions.ts";
import {
  listCreatedSubscription,
  listUpdatedSubscription,
  listDeletedSubscription,
} from "./listSubscriptions.ts";
import {
  folderCreatedSubscription,
  folderUpdatedSubscription,
  folderDeletedSubscription,
} from "./folderSubscriptions.ts";
import {
  spaceCreatedSubscription,
  spaceUpdatedSubscription,
  spaceDeletedSubscription,
} from "./spaceSubscriptions.ts";
import {
  goalCreatedSubscription,
  goalUpdatedSubscription,
  goalDeletedSubscription,
} from "./goalSubscriptions.ts";
import {
  keyResultCreatedSubscription,
  keyResultUpdatedSubscription,
  keyResultDeletedSubscription,
} from "./keyResultSubscriptions.ts";

export const subscriptions = {
  // Task Events
  taskCreated: taskCreatedSubscription,
  taskUpdated: taskUpdatedSubscription,
  taskDeleted: taskDeletedSubscription,
  taskPriorityUpdated: taskPriorityUpdatedSubscription,
  taskStatusUpdated: taskStatusUpdatedSubscription,
  taskAssigneeUpdated: taskAssigneeUpdatedSubscription,
  taskDueDateUpdated: taskDueDateUpdatedSubscription,
  taskTagUpdated: taskTagUpdatedSubscription,
  taskMoved: taskMovedSubscription,
  taskCommentPosted: taskCommentPostedSubscription,
  taskCommentUpdated: taskCommentUpdatedSubscription,
  taskTimeEstimateUpdated: taskTimeEstimateUpdatedSubscription,
  taskTimeTrackedUpdated: taskTimeTrackedUpdatedSubscription,

  // List Events
  listCreated: listCreatedSubscription,
  listUpdated: listUpdatedSubscription,
  listDeleted: listDeletedSubscription,

  // Folder Events
  folderCreated: folderCreatedSubscription,
  folderUpdated: folderUpdatedSubscription,
  folderDeleted: folderDeletedSubscription,

  // Space Events
  spaceCreated: spaceCreatedSubscription,
  spaceUpdated: spaceUpdatedSubscription,
  spaceDeleted: spaceDeletedSubscription,

  // Goal Events
  goalCreated: goalCreatedSubscription,
  goalUpdated: goalUpdatedSubscription,
  goalDeleted: goalDeletedSubscription,

  // Key Result Events
  keyResultCreated: keyResultCreatedSubscription,
  keyResultUpdated: keyResultUpdatedSubscription,
  keyResultDeleted: keyResultDeletedSubscription,
};
