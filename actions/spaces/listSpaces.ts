import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Spaces
const inputSchema = {
  archived: {
    name: "Archived",
    description: "Whether to include archived items",
    type: "boolean",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for List Spaces
const outputSchema = {
  required: ["spaces"],
  type: "object",
  properties: {
    spaces: {
      type: "array",
      items: {
        required: [
          "id",
          "name",
          "private",
          "statuses",
          "multiple_assignees",
          "features",
        ],
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
          },
          private: {
            type: "boolean",
          },
          color: {
            type: "string",
          },
          avatar: {
            type: "string",
          },
          admin_can_manage: {
            type: "boolean",
          },
          archived: {
            type: "boolean",
          },
          members: {
            type: "array",
            items: {
              required: ["user"],
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
                      type: "string",
                    },
                    profilePicture: {
                      type: "string",
                    },
                    initials: {
                      type: "string",
                    },
                    week_start_day: {
                      type: "integer",
                      description:
                        "The user's preferred start of the calendar week setting. \\ `0` is Sunday. \\ `1` is Monday.",
                    },
                    global_font_support: {
                      type: "boolean",
                    },
                    timezeone: {
                      type: "string",
                    },
                  },
                },
              },
            },
            user: {
              id: {
                type: "string",
              },
              username: {
                type: "string",
              },
              color: {
                type: "string",
              },
              profilePicture: {
                type: "string",
              },
              initials: {
                type: "string",
              },
            },
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
          multiple_assignees: {
            type: "boolean",
          },
          features: {
            required: [
              "due_dates",
              "time_tracking",
              "tags",
              "time_estimates",
              "checklists",
            ],
            type: "object",
            properties: {
              due_dates: {
                required: [
                  "enabled",
                  "start_date",
                  "remap_due_dates",
                  "remap_closed_due_date",
                ],
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                  },
                  start_date: {
                    type: "boolean",
                  },
                  remap_due_dates: {
                    type: "boolean",
                  },
                  remap_closed_due_date: {
                    type: "boolean",
                  },
                },
              },
              time_tracking: {
                required: ["enabled"],
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                  },
                },
              },
              tags: {
                required: ["enabled"],
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                  },
                },
              },
              time_estimates: {
                required: ["enabled"],
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                  },
                },
              },
              checklists: {
                required: ["enabled"],
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                  },
                },
              },
              custom_fields: {
                required: ["enabled"],
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                  },
                },
              },
              remap_dependencies: {
                required: ["enabled"],
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                  },
                },
              },
              dependency_warning: {
                required: ["enabled"],
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                  },
                },
              },
              portfolios: {
                required: ["enabled"],
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
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
  name: "List Spaces",
  description: "Retrieves list spaces in ClickUp",
  category: "Spaces",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const endpoint = `/v2/team/${input.app.signals.teamId}/space`;

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
