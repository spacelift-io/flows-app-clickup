import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Time Entries
const inputSchema = {
  assignee: {
    name: "Assignee",
    description: "The user ID to assign",
    type: "number",
    required: false,
  },
  custom_task_ids: {
    name: "Custom Task IDs",
    description:
      "If you want to reference a task by it's custom task id, this value must be `true`.",
    type: "boolean",
    required: false,
  },
  end_date: {
    name: "End Date",
    description: "Unix time in milliseconds",
    type: "number",
    required: false,
  },
  folder_id: {
    name: "Folder ID",
    description:
      "Only include time entries associated with tasks in a specific Folder.",
    type: "number",
    required: false,
  },
  include_approval_details: {
    name: "Include Approval Details",
    description:
      "Include the details of the approval for each time entry. Adds Approver ID, Approved Time, List of Approvers, and Approval Status.",
    type: "boolean",
    required: false,
  },
  include_approval_history: {
    name: "Include Approval History",
    description:
      "Include the history of the approval for each time entry. Adds status changes, notes, and approvers.",
    type: "boolean",
    required: false,
  },
  include_location_names: {
    name: "Include Location Names",
    description:
      "Include the names of the List, Folder, and Space along with the `list_id`,`folder_id`, and `space_id`.",
    type: "boolean",
    required: false,
  },
  include_task_tags: {
    name: "Include Task Tags",
    description:
      "Include task tags in the response for time entries associated with tasks.",
    type: "boolean",
    required: false,
  },
  is_billable: {
    name: "Is Billable",
    description:
      "Include only billable time entries by using a value of `true` or only non-billable time entries by using a value of `false`.\\ \\ For example: `?is_billable=true`.",
    type: "boolean",
    required: false,
  },
  list_id: {
    name: "List ID",
    description:
      "Only include time entries associated with tasks in a specific List.",
    type: "number",
    required: false,
  },
  space_id: {
    name: "Space ID",
    description:
      "Only include time entries associated with tasks in a specific Space.",
    type: "number",
    required: false,
  },
  start_date: {
    name: "Start Date",
    description: "Unix time in milliseconds",
    type: "number",
    required: false,
  },
  task_id: {
    name: "Task ID",
    description: "Only include time entries associated with a specific task.",
    type: "string",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for List Time Entries
const outputSchema = {
  required: ["data"],
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        required: [
          "id",
          "task",
          "wid",
          "user",
          "billable",
          "start",
          "end",
          "duration",
          "description",
          "tags",
          "source",
          "at",
          "task_location",
          "task_tags",
          "task_url",
        ],
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          task: {
            required: ["id", "custom_id", "name", "status", "custom_type"],
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              custom_id: {
                type: "string",
              },
              name: {
                type: "string",
              },
              status: {
                required: ["status", "color", "orderindex", "type"],
                type: "object",
                properties: {
                  status: {
                    type: "string",
                  },
                  color: {
                    type: "string",
                  },
                  orderindex: {
                    type: "integer",
                  },
                  type: {
                    type: "string",
                  },
                },
              },
              custom_type: {
                anyOf: [
                  {
                    type: "string",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            },
          },
          wid: {
            type: "string",
          },
          user: {
            required: [
              "id",
              "username",
              "initials",
              "email",
              "color",
              "profilePicture",
            ],
            type: "object",
            properties: {
              id: {
                type: "integer",
              },
              username: {
                type: "string",
              },
              initials: {
                type: "string",
              },
              email: {
                type: "string",
              },
              color: {
                type: "string",
              },
              profilePicture: {
                type: "string",
              },
            },
          },
          billable: {
            type: "boolean",
          },
          start: {
            type: "string",
          },
          end: {
            type: "string",
          },
          duration: {
            type: "string",
          },
          description: {
            type: "string",
          },
          tags: {
            type: "array",
            items: {
              type: "string",
            },
          },
          source: {
            type: "string",
          },
          at: {
            type: "string",
          },
          approval_id: {
            type: "string",
            description: "ID of the associated approval",
          },
          approval: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "Unique identifier for the approval",
              },
              workspace_id: {
                type: "integer",
                description: "ID of the workspace this approval belongs to",
              },
              status: {
                type: "string",
                description:
                  "Current status of the approval (e.g., 'approved', 'pending')",
              },
              data: {
                type: "object",
                properties: {
                  end_of_week: {
                    type: "integer",
                    description: "Timestamp for the end of the week",
                  },
                  start_of_week: {
                    type: "integer",
                    description: "Timestamp for the start of the week",
                  },
                },
              },
              user: {
                required: [
                  "id",
                  "username",
                  "email",
                  "color",
                  "initials",
                  "profilePicture",
                ],
                type: "object",
                properties: {
                  id: {
                    type: "integer",
                  },
                  username: {
                    type: "string",
                  },
                  email: {
                    type: "string",
                  },
                  color: {
                    type: "string",
                  },
                  initials: {
                    type: "string",
                  },
                  profilePicture: {
                    anyOf: [
                      {
                        type: "string",
                      },
                      {
                        type: "null",
                      },
                    ],
                  },
                },
              },
              approvers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      description: "ID of the user who can approve the request",
                    },
                  },
                },
              },
              approver_id: {
                type: "integer",
                description: "ID of the user who approved the request",
              },
              approved_at: {
                type: "integer",
                description: "Timestamp when the approval was granted",
              },
              history: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      description: "Unique identifier for the history entry",
                    },
                    field: {
                      type: "string",
                      description: "Field that was changed",
                    },
                    before: {
                      type: "string",
                      description: "Previous value",
                    },
                    after: {
                      type: "string",
                      description: "New value",
                    },
                    created_at: {
                      type: "integer",
                      description: "Timestamp when the change was made",
                    },
                    user: {
                      required: [
                        "id",
                        "username",
                        "email",
                        "color",
                        "initials",
                        "profilePicture",
                      ],
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                        },
                        username: {
                          type: "string",
                        },
                        email: {
                          type: "string",
                        },
                        color: {
                          type: "string",
                        },
                        initials: {
                          type: "string",
                        },
                        profilePicture: {
                          anyOf: [
                            {
                              type: "string",
                            },
                            {
                              type: "null",
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          task_location: {
            required: [
              "list_id",
              "folder_id",
              "space_id",
              "list_name",
              "folder_name",
              "space_name",
            ],
            type: "object",
            properties: {
              list_id: {
                type: "integer",
              },
              folder_id: {
                type: "integer",
              },
              space_id: {
                type: "integer",
              },
              list_name: {
                type: "string",
              },
              folder_name: {
                type: "string",
              },
              space_name: {
                type: "string",
              },
            },
          },
          task_tags: {
            type: "array",
            items: {
              required: ["name", "tag_fg", "tag_bg", "creator"],
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                tag_fg: {
                  type: "string",
                },
                tag_bg: {
                  type: "string",
                },
                creator: {
                  type: "integer",
                },
              },
            },
          },
          task_url: {
            type: "string",
          },
        },
      },
    },
  },
} as Type;

export default {
  name: "List Time Entries",
  description: "Retrieves list time entries in ClickUp",
  category: "Time Tracking",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { team_Id } = input.event.inputConfig;
        const endpoint = `/v2/team/${team_Id}/time_entries`;

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
