export const schemaDefinitions: Record<string, string> = {
  // Checklists
  createChecklist: "POST /v2/task/{task_id}/checklist",
  updateChecklist: "PUT /v2/checklist/{checklist_id}",
  deleteChecklist: "DELETE /v2/checklist/{checklist_id}",
  createChecklistItem: "POST /v2/checklist/{checklist_id}/checklist_item",
  updateChecklistItem:
    "PUT /v2/checklist/{checklist_id}/checklist_item/{checklist_item_id}",
  deleteChecklistItem:
    "DELETE /v2/checklist/{checklist_id}/checklist_item/{checklist_item_id}",

  // Comments
  createComment: "POST /v2/task/{task_id}/comment",
  createThreadedComment: "POST /v2/comment/{comment_id}/reply",
  deleteComment: "DELETE /v2/comment/{comment_id}",
  getComment: "GET /v2/comment/{comment_id}/reply",
  listComments: "GET /v2/task/{task_id}/comment",
  updateComment: "PUT /v2/comment/{comment_id}",

  // Custom Fields
  getAccessibleCustomFields: "GET /v2/list/{list_id}/field",
  removeCustomFieldValue: "DELETE /v2/task/{task_id}/field/{field_id}",
  setCustomFieldValue: "POST /v2/task/{task_id}/field/{field_id}",

  // Folders
  listFolders: "GET /v2/space/{space_id}/folder",
  createFolder: "POST /v2/space/{space_id}/folder",
  getFolder: "GET /v2/folder/{folder_id}",
  updateFolder: "PUT /v2/folder/{folder_id}",
  deleteFolder: "DELETE /v2/folder/{folder_id}",

  // Goals
  listGoals: "GET /v2/team/{team_id}/goal",
  createGoal: "POST /v2/team/{team_id}/goal",
  getGoal: "GET /v2/goal/{goal_id}",
  updateGoal: "PUT /v2/goal/{goal_id}",
  deleteGoal: "DELETE /v2/goal/{goal_id}",
  createKeyResult: "POST /v2/goal/{goal_id}/key_result",
  updateKeyResult: "PUT /v2/key_result/{key_result_id}",
  deleteKeyResult: "DELETE /v2/key_result/{key_result_id}",

  // Guests
  addGuestToFolder: "POST /v2/folder/{folder_id}/guest/{guest_id}",

  // Lists
  listLists: "GET /v2/folder/{folder_id}/list",
  createList: "POST /v2/folder/{folder_id}/list",
  getList: "GET /v2/list/{list_id}",
  updateList: "PUT /v2/list/{list_id}",
  deleteList: "DELETE /v2/list/{list_id}",

  // Spaces
  listSpaces: "GET /v2/team/{team_id}/space",
  createSpace: "POST /v2/team/{team_id}/space",
  getSpace: "GET /v2/space/{space_id}",
  updateSpace: "PUT /v2/space/{space_id}",
  deleteSpace: "DELETE /v2/space/{space_id}",

  // Tags
  listTags: "GET /v2/space/{space_id}/tag",
  createTag: "POST /v2/space/{space_id}/tag",
  updateTag: "PUT /v2/space/{space_id}/tag/{tag_name}",
  deleteTag: "DELETE /v2/space/{space_id}/tag/{tag_name}",
  addTagToTask: "POST /v2/task/{task_id}/tag/{tag_name}",
  removeTagFromTask: "DELETE /v2/task/{task_id}/tag/{tag_name}",

  // Tasks
  listTasks: "GET /v2/list/{list_id}/task",
  createTask: "POST /v2/list/{list_id}/task",
  getTask: "GET /v2/task/{task_id}",
  updateTask: "PUT /v2/task/{task_id}",
  deleteTask: "DELETE /v2/task/{task_id}",

  // Team Management
  listWorkspaces: "GET /v2/team",
  inviteUserToWorkspace: "POST /v2/team/{team_id}/user",
  editUserOnWorkspace: "PUT /v2/team/{team_id}/user/{user_id}",
  getAuthorizedUser: "GET /v2/user",
  removeUserFromWorkspace: "DELETE /v2/team/{team_id}/user/{user_id}",
  editGuestOnWorkspace: "PUT /v2/team/{team_id}/guest/{guest_id}",
  getGuest: "GET /v2/team/{team_id}/guest/{guest_id}",
  getUser: "GET /v2/team/{team_id}/user/{user_id}",
  getTaskMembers: "GET /v2/task/{task_id}/member",
  getListMembers: "GET /v2/list/{list_id}/member",

  // Templates
  createFolderFromTemplate:
    "POST /v2/space/{space_id}/folder_template/{template_id}",
  createFolderListFromTemplate:
    "POST /v2/folder/{folder_id}/list_template/{template_id}",
  listTaskTemplates: "GET /v2/team/{team_id}/taskTemplate",
  createTaskFromTemplate: "POST /v2/list/{list_id}/taskTemplate/{template_id}",
  createSpaceListFromTemplate:
    "POST /v2/space/{space_id}/list_template/{template_id}",

  // Time Tracking
  listTimeEntries: "GET /v2/team/{team_Id}/time_entries",
  createTimeEntry: "POST /v2/team/{team_Id}/time_entries",
  updateTimeEntry: "PUT /v2/team/{team_id}/time_entries/{timer_id}",
  deleteTimeEntry: "DELETE /v2/team/{team_id}/time_entries/{timer_id}",
  startTimeEntry: "POST /v2/team/{team_Id}/time_entries/start",
  stopTimeEntry: "POST /v2/team/{team_id}/time_entries/stop",

  // Views
  getView: "GET /v2/view/{view_id}",
  updateView: "PUT /v2/view/{view_id}",
  deleteView: "DELETE /v2/view/{view_id}",
  listViewTasks: "GET /v2/view/{view_id}/task",
  createTeamView: "POST /v2/team/{team_id}/view",

  // Webhooks
  listWebhooks: "GET /v2/team/{team_id}/webhook",
  createWebhook: "POST /v2/team/{team_id}/webhook",
  updateWebhook: "PUT /v2/webhook/{webhook_id}",
  deleteWebhook: "DELETE /v2/webhook/{webhook_id}",
};
