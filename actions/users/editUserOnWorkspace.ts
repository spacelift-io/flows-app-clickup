import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import {
  makeClickUpApiRequest,
  filterDefinedParams,
} from "../../utils/apiHelpers.ts";

// Input schema for Edit User On Workspace
const inputSchema = {
  admin: {
    name: "Admin",
    description: "Whether the user should have admin privileges",
    type: "boolean",
    required: true,
  },
  custom_role_id: {
    name: "Custom Role ID",
    description: "",
    type: "number",
    required: true,
  },
  user_id: {
    name: "User ID",
    description: "",
    type: "number",
    required: true,
  },
  username: {
    name: "Username",
    description: "The username",
    type: "string",
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Edit User On Workspace
const outputSchema = {
  required: ["member"],
  type: "object",
  properties: {
    member: {
      type: "object",
      properties: {
        user: {
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
              anyOf: [
                {
                  type: "string",
                },
                {
                  type: "null",
                },
              ],
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
            initials: {
              type: "string",
            },
            role: {
              description: "Owner = 1, Admin = 2, Member = 3, Guest = 4",
              type: "integer",
            },
            custom_role: {
              required: ["id", "name"],
              type: "object",
              properties: {
                id: {
                  type: "integer",
                },
                name: {
                  type: "string",
                },
              },
            },
            last_active: {
              anyOf: [
                {
                  type: "string",
                },
                {
                  type: "null",
                },
              ],
            },
            date_joined: {
              anyOf: [
                {
                  type: "string",
                },
                {
                  type: "null",
                },
              ],
            },
            date_invited: {
              type: "string",
            },
          },
        },
        invited_by: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            color: {
              type: "string",
            },
            username: {
              type: "string",
            },
            email: {
              type: "string",
            },
            initials: {
              type: "string",
            },
            profilePicture: {
              type: "string",
            },
          },
        },
        shared: {
          type: "object",
          properties: {
            tasks: {
              type: "array",
              items: {
                type: "string",
              },
            },
            lists: {
              type: "array",
              items: {
                type: "string",
              },
            },
            folders: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
} as Type;

export default {
  name: "Edit User On Workspace",
  description: "Updates edit user on workspace in ClickUp",
  category: "Users",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { user_id, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/team/${input.app.signals.teamId}/user/${user_id}`;

        await events.emit(
          await makeClickUpApiRequest(
            input.app.signals.accessToken!,
            endpoint,
            {
              method: "PUT",
              body: filterDefinedParams(inputData),
            },
          ),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
