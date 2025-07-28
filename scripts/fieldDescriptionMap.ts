export const fieldDescriptions: Record<string, string> = {
  // IDs
  taskId: "The unique identifier of the task",
  listId: "The unique identifier of the list",
  listIds: "Array of list identifiers",
  spaceId: "The unique identifier of the space",
  folderId: "The unique identifier of the folder",
  commentId: "The unique identifier of the comment",
  checklistId: "The unique identifier of the checklist",
  checklistItemId: "The unique identifier of the checklist item",
  goalId: "The unique identifier of the goal",
  tagId: "The unique identifier of the tag",
  viewId: "The unique identifier of the view",
  webhookId: "The unique identifier of the webhook",
  userId: "The unique identifier of the user",
  guestId: "The unique identifier of the guest",
  templateId: "The unique identifier of the template",
  timeEntryId: "The unique identifier of the time entry",
  timerId: "The unique identifier of the timer",
  customFieldId: "The unique identifier of the custom field",
  customRoleId: "The unique identifier of the custom role",
  fieldId: "The unique identifier of the field",
  keyResultId: "The unique identifier of the key result",
  parentTask: "The ID of the parent task for creating subtasks",
  workspaceId: "The unique identifier of the workspace",
  teamId: "The unique identifier of the workspace",

  // Names and text
  name: "The name",
  taskName: "The name of the task",
  tagName: "The name of the tag",
  spaceName: "The name of the space",
  username: "The username",
  email: "The email address",
  description: "A detailed description",
  commentText: "The text content of the comment",
  content: "The main content",
  note: "Additional note or comment",
  tag: "The tag information",

  // Dates and times
  dueDate: "The due date in Unix timestamp format",
  dueDateTime: "The due date and time in Unix timestamp format",
  startDate: "The start date in Unix timestamp format",
  startDateTime: "The start date and time in Unix timestamp format",
  timeEstimate: "Time estimate in milliseconds",
  duration: "When there are values for both start and end, duration is ignored",
  start: "The start time in Unix timestamp format",
  end: "The end time in Unix timestamp format",
  stop: "The stop time parameter, can be used instead of duration",

  // User assignments and groups
  assignee: "The user ID to assign",
  assignees: "Array of user IDs to assign",
  groupAssignee: "The user group ID to assign",
  groupAssignees: "Array of user group IDs to assign",
  commentAssignee: "The user ID to assign to the comment",
  owners: "Array of user IDs who own this item",

  // Status and priority
  status: "The status of the item",
  priority: "The priority level",
  resolved: "Whether the item is resolved",
  color: "The color value or code",

  // Boolean flags
  notifyAll: "Whether to notify all team members",
  customTaskIds: "Whether to use custom task IDs instead of regular IDs",
  includeSubtasks: "Whether to include subtasks in the results",
  includeCompleted: "Whether to include completed items",
  admin: "Whether the user should have admin privileges",
  archived: "Whether to include archived items",
  billable: "Whether the time entry is billable",
  private: "Whether the item is private",
  multipleAssignees: "Whether to allow multiple assignees",
  multipleOwners: "Whether to allow multiple owners",

  // Arrays and collections
  tags: "Array of tag names to apply",
  customFields: "Array of custom field values",
  watchers: "Array of user IDs to watch this item",
  events: "Array of webhook event types to listen for",

  // Pagination and filtering
  page: "Page number for pagination",
  limit: "Maximum number of items to return",
  orderBy: "Field to order results by",
  reverse: "Whether to reverse the order",
  subtasks: "Whether to include subtasks",

  // Goals and progress
  stepsCurrent: "The current step number",
  stepsStart: "The starting step number",
  stepsEnd: "The ending step number",
  unit: "The unit of measurement",

  // Webhooks
  endpoint: "The webhook endpoint URL",
  tagAction: "The action to perform on tags",

  // Technical fields
  tid: "The team identifier",
  fields: "Array of field identifiers",

  // Additional specific fields
  features: "Configuration object for space features and settings",
  checkRequiredCustomFields:
    "Whether to validate required custom fields when creating tasks",
  linksTo: "Task ID to create a linked dependency with the new task",
  parent: "Parent task ID for creating subtasks",
  points: "Sprint points value for the task",
  customItemId: "Custom task type ID for this task",
  markdownContent: "Markdown formatted description content",
  includeTaskTags: "Whether to include task tags in the response",
  properties: "Configuration properties for the item",
};
