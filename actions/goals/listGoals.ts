import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Goals
const inputSchema = {
  include_completed: {
    name: "Include Completed",
    description: "",
    type: "boolean",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for List Goals
const outputSchema = {
  required: ["goals", "folders"],
  type: "object",
  properties: {
    goals: {
      type: "array",
      items: {
        required: [
          "id",
          "pretty_id",
          "name",
          "team_id",
          "creator",
          "owner",
          "color",
          "date_created",
          "start_date",
          "due_date",
          "description",
          "private",
          "archived",
          "multiple_owners",
          "editor_token",
          "date_updated",
          "last_update",
          "folder_id",
          "pinned",
          "owners",
          "key_result_count",
          "members",
          "group_members",
          "percent_completed",
        ],
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          pretty_id: {
            type: "string",
          },
          name: {
            type: "string",
          },
          team_id: {
            type: "string",
          },
          creator: {
            type: "integer",
          },
          owner: {
            anyOf: [
              {
                type: "string",
              },
              {
                type: "null",
              },
            ],
          },
          color: {
            type: "string",
          },
          date_created: {
            type: "string",
          },
          start_date: {
            anyOf: [
              {
                type: "string",
              },
              {
                type: "null",
              },
            ],
          },
          due_date: {
            type: "string",
          },
          description: {
            type: "string",
          },
          private: {
            type: "boolean",
          },
          archived: {
            type: "boolean",
          },
          multiple_owners: {
            type: "boolean",
          },
          editor_token: {
            type: "string",
          },
          date_updated: {
            type: "string",
          },
          last_update: {
            type: "string",
          },
          folder_id: {
            anyOf: [
              {
                type: "string",
              },
              {
                type: "null",
              },
            ],
          },
          pinned: {
            type: "boolean",
          },
          owners: {
            type: "array",
            items: {
              type: "string",
            },
          },
          key_result_count: {
            type: "integer",
          },
          members: {
            type: "array",
            items: {
              required: [
                "id",
                "username",
                "email",
                "color",
                "permission_level",
                "profilePicture",
                "initials",
                "isCreator",
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
                permission_level: {
                  type: "string",
                },
                profilePicture: {
                  type: "string",
                },
                initials: {
                  type: "string",
                },
                isCreator: {
                  type: "boolean",
                },
              },
            },
          },
          group_members: {
            type: "array",
            items: {
              type: "string",
            },
          },
          percent_completed: {
            type: "integer",
          },
        },
      },
    },
    folders: {
      type: "array",
      items: {
        required: [
          "id",
          "name",
          "team_id",
          "private",
          "date_created",
          "creator",
          "goal_count",
          "members",
          "goals",
        ],
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
          },
          team_id: {
            type: "string",
          },
          private: {
            type: "boolean",
          },
          date_created: {
            type: "string",
          },
          creator: {
            type: "integer",
          },
          goal_count: {
            type: "integer",
          },
          members: {
            type: "array",
            items: {
              required: [
                "id",
                "email",
                "username",
                "color",
                "permission_level",
                "date_added",
                "added_by",
                "initials",
                "profilePicture",
              ],
              type: "object",
              properties: {
                id: {
                  type: "integer",
                },
                email: {
                  type: "string",
                },
                username: {
                  type: "string",
                },
                color: {
                  type: "string",
                },
                permission_level: {
                  type: "string",
                },
                date_added: {
                  type: "integer",
                },
                added_by: {
                  type: "integer",
                },
                initials: {
                  type: "string",
                },
                profilePicture: {
                  type: "string",
                },
              },
            },
          },
          goals: {
            type: "array",
            items: {
              required: [
                "id",
                "pretty_id",
                "name",
                "team_id",
                "creator",
                "owner",
                "color",
                "date_created",
                "start_date",
                "due_date",
                "description",
                "private",
                "archived",
                "multiple_owners",
                "editor_token",
                "date_updated",
                "last_update",
                "folder_id",
                "folder_access",
                "pinned",
                "owners",
                "key_result_count",
                "members",
                "group_members",
                "percent_completed",
              ],
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
                pretty_id: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
                team_id: {
                  type: "string",
                },
                creator: {
                  type: "integer",
                },
                owner: {
                  anyOf: [
                    {
                      type: "string",
                    },
                    {
                      type: "null",
                    },
                  ],
                },
                color: {
                  type: "string",
                },
                date_created: {
                  type: "string",
                },
                start_date: {
                  anyOf: [
                    {
                      type: "string",
                    },
                    {
                      type: "null",
                    },
                  ],
                },
                due_date: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
                private: {
                  type: "boolean",
                },
                archived: {
                  type: "boolean",
                },
                multiple_owners: {
                  type: "boolean",
                },
                editor_token: {
                  type: "string",
                },
                date_updated: {
                  type: "string",
                },
                last_update: {
                  type: "string",
                },
                folder_id: {
                  type: "string",
                },
                folder_access: {
                  type: "boolean",
                },
                pinned: {
                  type: "boolean",
                },
                owners: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                key_result_count: {
                  type: "integer",
                },
                members: {
                  type: "array",
                  items: {
                    required: [
                      "id",
                      "username",
                      "email",
                      "color",
                      "permission_level",
                      "profilePicture",
                      "initials",
                      "isCreator",
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
                      permission_level: {
                        type: "string",
                      },
                      profilePicture: {
                        type: "string",
                      },
                      initials: {
                        type: "string",
                      },
                      isCreator: {
                        type: "boolean",
                      },
                    },
                  },
                },
                group_members: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                percent_completed: {
                  type: "integer",
                },
              },
            },
          },
        },
      },
    },
  },
} as Type;

export default {
  name: "List Goals",
  description: "Retrieves list goals in ClickUp",
  category: "Goals",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const endpoint = `/v2/team/${input.app.signals.teamId}/goal`;

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
