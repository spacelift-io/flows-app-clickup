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

// Input schema for Edit Guest On Workspace
const inputSchema = {
  guest_id: {
    name: "Guest ID",
    description: "",
    type: "number",
    required: true,
  },
  can_create_views: {
    name: "Can Create Views",
    description: "",
    type: "boolean",
    required: false,
  },
  can_edit_tags: {
    name: "Can Edit Tags",
    description: "",
    type: "boolean",
    required: false,
  },
  can_see_points_estimated: {
    name: "Can See Points Estimated",
    description: "",
    type: "boolean",
    required: false,
  },
  can_see_time_estimated: {
    name: "Can See Time Estimated",
    description: "",
    type: "boolean",
    required: false,
  },
  can_see_time_spent: {
    name: "Can See Time Spent",
    description: "",
    type: "boolean",
    required: false,
  },
  custom_role_id: {
    name: "Custom Role ID",
    description: "",
    type: "number",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Edit Guest On Workspace
const outputSchema = {
  required: ["guest"],
  type: "object",
  properties: {
    guest: {
      type: "object",
      properties: {
        user: {
          required: [
            "id",
            "username",
            "email",
            "color",
            "profilePicture",
            "initials",
            "role",
            "custom_role",
            "last_active",
            "date_joined",
            "date_invited",
          ],
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            username: {
              anyOf: [
                {
                  type: "string",
                },
                {
                  type: "null",
                },
              ],
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
        can_see_time_spent: {
          type: "boolean",
        },
        can_see_time_estimated: {
          type: "boolean",
        },
        can_see_points_estimated: {
          type: "boolean",
        },
        can_edit_tags: {
          type: "boolean",
        },
        can_create_views: {
          type: "boolean",
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
  name: "Edit Guest On Workspace",
  description: "Updates edit guest on workspace in ClickUp",
  category: "Guests",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { guest_id, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/team/${input.app.signals.teamId}/guest/${guest_id}`;

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
