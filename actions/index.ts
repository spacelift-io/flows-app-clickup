import getAuthorizedUser from "./authorization/getAuthorizedUser.ts";
import listWorkspaces from "./authorization/listWorkspaces.ts";
import createComment from "./comments/createComment.ts";
import createThreadedComment from "./comments/createThreadedComment.ts";
import deleteComment from "./comments/deleteComment.ts";
import getComment from "./comments/getComment.ts";
import listComments from "./comments/listComments.ts";
import updateComment from "./comments/updateComment.ts";
import getAccessibleCustomFields from "./customFields/getAccessibleCustomFields.ts";
import removeCustomFieldValue from "./customFields/removeCustomFieldValue.ts";
import setCustomFieldValue from "./customFields/setCustomFieldValue.ts";
import createFolder from "./folders/createFolder.ts";
import createFolderFromTemplate from "./folders/createFolderFromTemplate.ts";
import deleteFolder from "./folders/deleteFolder.ts";
import getFolder from "./folders/getFolder.ts";
import listFolders from "./folders/listFolders.ts";
import updateFolder from "./folders/updateFolder.ts";
import createGoal from "./goals/createGoal.ts";
import createKeyResult from "./goals/createKeyResult.ts";
import deleteGoal from "./goals/deleteGoal.ts";
import deleteKeyResult from "./goals/deleteKeyResult.ts";
import getGoal from "./goals/getGoal.ts";
import listGoals from "./goals/listGoals.ts";
import updateGoal from "./goals/updateGoal.ts";
import updateKeyResult from "./goals/updateKeyResult.ts";
import addGuestToFolder from "./guests/addGuestToFolder.ts";
import editGuestOnWorkspace from "./guests/editGuestOnWorkspace.ts";
import getGuest from "./guests/getGuest.ts";
import createFolderListFromTemplate from "./lists/createFolderListFromTemplate.ts";
import createList from "./lists/createList.ts";
import createSpaceListFromTemplate from "./lists/createSpaceListFromTemplate.ts";
import deleteList from "./lists/deleteList.ts";
import getList from "./lists/getList.ts";
import listLists from "./lists/listLists.ts";
import updateList from "./lists/updateList.ts";
import getListMembers from "./members/getListMembers.ts";
import getTaskMembers from "./members/getTaskMembers.ts";
import createSpace from "./spaces/createSpace.ts";
import deleteSpace from "./spaces/deleteSpace.ts";
import getSpace from "./spaces/getSpace.ts";
import listSpaces from "./spaces/listSpaces.ts";
import updateSpace from "./spaces/updateSpace.ts";
import addTagToTask from "./tags/addTagToTask.ts";
import createTag from "./tags/createTag.ts";
import deleteTag from "./tags/deleteTag.ts";
import listTags from "./tags/listTags.ts";
import removeTagFromTask from "./tags/removeTagFromTask.ts";
import updateTag from "./tags/updateTag.ts";
import createChecklist from "./taskChecklists/createChecklist.ts";
import createChecklistItem from "./taskChecklists/createChecklistItem.ts";
import deleteChecklist from "./taskChecklists/deleteChecklist.ts";
import deleteChecklistItem from "./taskChecklists/deleteChecklistItem.ts";
import updateChecklist from "./taskChecklists/updateChecklist.ts";
import updateChecklistItem from "./taskChecklists/updateChecklistItem.ts";
import createTask from "./tasks/createTask.ts";
import createTaskFromTemplate from "./tasks/createTaskFromTemplate.ts";
import deleteTask from "./tasks/deleteTask.ts";
import getTask from "./tasks/getTask.ts";
import listTasks from "./tasks/listTasks.ts";
import updateTask from "./tasks/updateTask.ts";
import listTaskTemplates from "./templates/listTaskTemplates.ts";
import createTimeEntry from "./timeTracking/createTimeEntry.ts";
import deleteTimeEntry from "./timeTracking/deleteTimeEntry.ts";
import listTimeEntries from "./timeTracking/listTimeEntries.ts";
import startTimeEntry from "./timeTracking/startTimeEntry.ts";
import stopTimeEntry from "./timeTracking/stopTimeEntry.ts";
import updateTimeEntry from "./timeTracking/updateTimeEntry.ts";
import editUserOnWorkspace from "./users/editUserOnWorkspace.ts";
import getUser from "./users/getUser.ts";
import inviteUserToWorkspace from "./users/inviteUserToWorkspace.ts";
import removeUserFromWorkspace from "./users/removeUserFromWorkspace.ts";
import createTeamView from "./views/createTeamView.ts";
import deleteView from "./views/deleteView.ts";
import getView from "./views/getView.ts";
import listViewTasks from "./views/listViewTasks.ts";
import updateView from "./views/updateView.ts";
import createWebhook from "./webhooks/createWebhook.ts";
import deleteWebhook from "./webhooks/deleteWebhook.ts";
import listWebhooks from "./webhooks/listWebhooks.ts";
import updateWebhook from "./webhooks/updateWebhook.ts";

export const actions = {
  getAuthorizedUser,
  listWorkspaces,
  createComment,
  createThreadedComment,
  deleteComment,
  getComment,
  listComments,
  updateComment,
  getAccessibleCustomFields,
  removeCustomFieldValue,
  setCustomFieldValue,
  createFolder,
  createFolderFromTemplate,
  deleteFolder,
  getFolder,
  listFolders,
  updateFolder,
  createGoal,
  createKeyResult,
  deleteGoal,
  deleteKeyResult,
  getGoal,
  listGoals,
  updateGoal,
  updateKeyResult,
  addGuestToFolder,
  editGuestOnWorkspace,
  getGuest,
  createFolderListFromTemplate,
  createList,
  createSpaceListFromTemplate,
  deleteList,
  getList,
  listLists,
  updateList,
  getListMembers,
  getTaskMembers,
  createSpace,
  deleteSpace,
  getSpace,
  listSpaces,
  updateSpace,
  addTagToTask,
  createTag,
  deleteTag,
  listTags,
  removeTagFromTask,
  updateTag,
  createChecklist,
  createChecklistItem,
  deleteChecklist,
  deleteChecklistItem,
  updateChecklist,
  updateChecklistItem,
  createTask,
  createTaskFromTemplate,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
  listTaskTemplates,
  createTimeEntry,
  deleteTimeEntry,
  listTimeEntries,
  startTimeEntry,
  stopTimeEntry,
  updateTimeEntry,
  editUserOnWorkspace,
  getUser,
  inviteUserToWorkspace,
  removeUserFromWorkspace,
  createTeamView,
  deleteView,
  getView,
  listViewTasks,
  updateView,
  createWebhook,
  deleteWebhook,
  listWebhooks,
  updateWebhook,
};
