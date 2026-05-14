import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
  Type,
} from "@slflows/sdk/v1";
import {
  makeClickUpApiRequest,
  filterDefinedParams,
} from "../../utils/apiHelpers.ts";

// Input schema for Invite User To Workspace
const inputSchema = {
  admin: {
    name: "Admin",
    description: "Whether the user should have admin privileges",
    type: "boolean",
    required: true,
  },
  email: {
    name: "Email",
    description: "The email address",
    type: "string",
    required: true,
  },
  custom_role_id: {
    name: "Custom Role ID",
    description: "",
    type: {
      type: "integer",
    },
    required: false,
  },
} as Record<string, AppBlockInputConfigField>;

// Output schema for Invite User To Workspace
const outputSchema = {
  required: ["team"],
  type: "object",
  properties: {
    team: {
      required: ["id", "name", "color", "avatar", "members", "roles"],
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        name: {
          type: "string",
        },
        color: {
          type: "string",
        },
        avatar: {
          anyOf: [
            {
              type: "string",
            },
            {
              type: "null",
            },
          ],
        },
        members: {
          type: "array",
          items: {
            required: ["user", "invited_by"],
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
                    additionalProperties: true,
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
                additionalProperties: true,
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
                additionalProperties: true,
              },
            },
            additionalProperties: true,
          },
        },
        roles: {
          type: "array",
          items: {
            required: ["id", "name", "custom"],
            type: "object",
            properties: {
              id: {
                type: "integer",
              },
              name: {
                type: "string",
              },
              custom: {
                type: "boolean",
              },
              inherited_role: {
                type: "integer",
              },
            },
            additionalProperties: true,
          },
        },
      },
      additionalProperties: true,
    },
  },
  additionalProperties: true,
} as Type;

export default {
  name: "Invite User To Workspace",
  description: "Creates invite user to workspace in ClickUp",
  category: "Users",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const inputData = input.event.inputConfig;
        const endpoint = `/v2/team/${input.app.signals.teamId}/user`;

        await events.emit(
          await makeClickUpApiRequest(
            input.app.signals.accessToken!,
            endpoint,
            {
              method: "POST",
              body: filterDefinedParams(inputData),
            },
          ),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
