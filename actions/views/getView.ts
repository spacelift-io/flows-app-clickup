import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get View
const inputSchema = {
  view_id: {
    name: "View ID",
    description: "",
    type: "string",
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Get View
const outputSchema = {
  required: ["view"],
  type: "object",
  properties: {
    view: {
      required: [
        "id",
        "name",
        "type",
        "parent",
        "grouping",
        "divide",
        "sorting",
        "filters",
        "columns",
        "team_sidebar",
        "settings",
      ],
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        name: {
          type: "string",
        },
        type: {
          type: "string",
        },
        parent: {
          description:
            "The parent parameter specifies where the view is located in the ClickUp Hierarchy. Both `id` and `type` are required. \\\n \\\nThe `id` is the id of the Workspace, Space, Folder, or List where the view is located. \\\n \\\nThe `type` value indciates the level of the Hierarchy where the view is located.",
          required: ["id", "type"],
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "The id of the Workspace, Space, Folder, or List where the view is located.",
            },
            type: {
              type: "integer",
              description:
                "The level of the Hierarchy where the view is created. \\\n \\\nOptions include: \\\n \\\nWorkspace (Everything Level): `7` \\\n \\\nSpace: `4` \\\n \\\nFolder: `5` \\\n \\\nList: `6`",
            },
          },
        },
        grouping: {
          required: ["field", "dir", "collapsed", "ignore"],
          type: "object",
          properties: {
            field: {
              type: "string",
              description:
                "Set the field to group by.\\\n \\\nOptions include: `none`, `status`, `priority`, `assignee`, `tag`, or `dueDate`.",
            },
            dir: {
              description:
                "Set a group sort order using `1` or `-1`.\\\n \\\nFor example, use `1`show tasks with urgent priority at the top of your view, and tasks with no priority at the bottom.\\\n \\\nUse `-1` to reverse the order to show tasks with no priority at the top of your view.",
              type: "integer",
            },
            collapsed: {
              type: "array",
              items: {
                type: "string",
              },
            },
            ignore: {
              type: "boolean",
            },
          },
        },
        divide: {
          required: ["collapsed"],
          type: "object",
          properties: {
            field: {
              anyOf: [
                {
                  type: "null",
                },
              ],
            },
            dir: {
              anyOf: [
                {
                  type: "null",
                },
              ],
            },
            collapsed: {
              anyOf: [
                {
                  type: "boolean",
                },
              ],
            },
          },
        },
        sorting: {
          required: ["fields"],
          type: "object",
          properties: {
            fields: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "Include an array of fields to sort by.\\\n \\\n You can sort by the same fields available when [filtering a view](doc:filter-views).",
            },
          },
        },
        filters: {
          required: ["op", "fields", "search", "show_closed"],
          type: "object",
          properties: {
            op: {
              type: "string",
              description:
                "The available operator (`op``) values are `AND`` and `OR``.",
            },
            fields: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "View the list of [fields available](doc:filter-views) to filter by.",
            },
            search: {
              type: "string",
            },
            show_closed: {
              type: "boolean",
            },
          },
        },
        columns: {
          description:
            "Custom Fields added to a view at the Everything level will be added to all tasks in your Workspace. Once Custom Fields are added to one of these views, you cannot move it to another level of the Hierarchy.",
          required: ["fields"],
          type: "object",
          properties: {
            fields: {
              description:
                "Custom Fields require the `cf_` prefix and must be formatted as a JSON object. Example: `cf_eb1234567890-c676-4c10-9012-345678901234`",
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },
        team_sidebar: {
          required: ["assignees", "assigned_comments", "unassigned_tasks"],
          type: "object",
          properties: {
            assignees: {
              type: "array",
              items: {
                type: "string",
              },
            },
            assigned_comments: {
              type: "boolean",
            },
            unassigned_tasks: {
              type: "boolean",
            },
          },
        },
        settings: {
          required: [
            "show_task_locations",
            "show_subtasks",
            "show_subtask_parent_names",
            "show_closed_subtasks",
            "show_assignees",
            "show_images",
            "collapse_empty_columns",
            "me_comments",
            "me_subtasks",
            "me_checklists",
          ],
          type: "object",
          properties: {
            show_task_locations: {
              type: "boolean",
            },
            show_subtasks: {
              description:
                "Acceptable values are `1`, `2`, or `3`, which show subtasks separate, expanded, or collapsed.",
              type: "integer",
            },
            show_subtask_parent_names: {
              type: "boolean",
            },
            show_closed_subtasks: {
              type: "boolean",
            },
            show_assignees: {
              type: "boolean",
            },
            show_images: {
              type: "boolean",
            },
            collapse_empty_columns: {
              anyOf: [
                {
                  type: "string",
                },
                {
                  type: "null",
                },
              ],
            },
            me_comments: {
              type: "boolean",
            },
            me_subtasks: {
              type: "boolean",
            },
            me_checklists: {
              type: "boolean",
            },
          },
        },
      },
    },
  },
} as Type;

export default {
  name: "Get View",
  description: "Retrieves get view in ClickUp",
  category: "Views",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { view_id } = input.event.inputConfig;
        const endpoint = `/v2/view/${view_id}`;

        await events.emit(
          await makeClickUpApiRequest(
            input.app.signals.accessToken!,
            endpoint,
            { method: "GET" },
          ),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
