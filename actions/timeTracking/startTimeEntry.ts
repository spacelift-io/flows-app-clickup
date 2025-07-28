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

// Input schema for Start Time Entry
const inputSchema = {
  billable: {
    name: "Billable",
    description: "Whether the time entry is billable",
    type: "boolean",
    required: false,
  },
  custom_task_ids: {
    name: "Custom Task IDs",
    description:
      "If you want to reference a task by it's custom task id, this value must be `true`.",
    type: "boolean",
    required: false,
  },
  description: {
    name: "Description",
    description: "A detailed description",
    type: "string",
    required: false,
  },
  tags: {
    name: "Tags",
    description: "Array of tag names to apply",
    type: {
      description:
        "Users on the Business Plan and above can include a time tracking label.",
      type: "array",
      items: {
        required: ["name"],
        type: "object",
        properties: {
          name: {
            type: "string",
          },
        },
      },
    },
    required: false,
  },
  tid: {
    name: "Tid",
    description: "The team identifier",
    type: "string",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Start Time Entry
const outputSchema = {
  required: ["data"],
  type: "object",
  properties: {
    data: {
      required: [
        "id",
        "task",
        "wid",
        "user",
        "billable",
        "start",
        "duration",
        "description",
        "tags",
        "at",
      ],
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        task: {
          required: ["id", "name", "status", "custom_type"],
          type: "object",
          properties: {
            id: {
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
        duration: {
          type: "integer",
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
        at: {
          type: "integer",
        },
      },
    },
  },
} as Type;

export default {
  name: "Start Time Entry",
  description: "Creates start time entry in ClickUp",
  category: "Time Tracking",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { team_Id, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/team/${team_Id}/time_entries/start`;

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
