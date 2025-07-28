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

// Input schema for Add Guest To Folder
const inputSchema = {
  folder_id: {
    name: "Folder ID",
    description: "",
    type: "number",
    required: true,
  },
  guest_id: {
    name: "Guest ID",
    description: "",
    type: "number",
    required: true,
  },
  permission_level: {
    name: "Permission Level",
    description:
      "Can be `read` (view only), `comment`, `edit`, or `create` (full).",
    type: "string",
    required: true,
  },
  include_shared: {
    name: "Include Shared",
    description:
      "Exclude details of items shared with the guest by setting this parameter to `false`. By default this parameter is set to `true`.",
    type: "boolean",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Add Guest To Folder
const outputSchema = {
  required: ["guest"],
  type: "object",
  properties: {
    guest: {
      required: [
        "user",
        "invited_by",
        "can_see_time_spent",
        "can_see_time_estimated",
        "can_edit_tags",
        "shared",
      ],
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
        can_edit_tags: {
          type: "boolean",
        },
        shared: {
          required: ["tasks", "lists", "folders"],
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
                required: [
                  "id",
                  "name",
                  "orderindex",
                  "override_statuses",
                  "hidden",
                  "task_count",
                  "archived",
                  "statuses",
                  "lists",
                  "permission_level",
                ],
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  name: {
                    type: "string",
                  },
                  orderindex: {
                    type: "integer",
                  },
                  override_statuses: {
                    type: "boolean",
                  },
                  hidden: {
                    type: "boolean",
                  },
                  task_count: {
                    type: "string",
                  },
                  archived: {
                    type: "boolean",
                  },
                  statuses: {
                    type: "array",
                    items: {
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
                  },
                  lists: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  permission_level: {
                    type: "string",
                  },
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
  name: "Add Guest To Folder",
  description: "Creates add guest to folder in ClickUp",
  category: "Guests",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { folder_id, guest_id, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/folder/${folder_id}/guest/${guest_id}`;

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
