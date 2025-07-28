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

// Input schema for Create Key Result
const inputSchema = {
  goal_id: {
    name: "Goal ID",
    description: "",
    type: "string",
    required: true,
  },
  list_ids: {
    name: "List IDs",
    description:
      "Enter an array of List IDs to link this target with one or more Lists.",
    type: ["string"],
    required: true,
  },
  name: {
    name: "Name",
    description: "The name",
    type: "string",
    required: true,
  },
  owners: {
    name: "Owners",
    description: "Array of user IDs who own this item",
    type: ["number"],
    required: true,
  },
  steps_end: {
    name: "Steps End",
    description: "",
    type: "number",
    required: true,
  },
  steps_start: {
    name: "Steps Start",
    description: "",
    type: "number",
    required: true,
  },
  task_ids: {
    name: "Task IDs",
    description:
      "Enter an array of task IDs to link this target with one or more tasks.",
    type: ["string"],
    required: true,
  },
  type: {
    name: "Type",
    description:
      "Target (key result) types include: `number`, `currency`, `boolean`, `percentage`, or `automatic`.",
    type: "string",
    required: true,
  },
  unit: {
    name: "Unit",
    description: "The unit of measurement",
    type: "string",
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Create Key Result
const outputSchema = {
  required: ["key_result"],
  type: "object",
  properties: {
    key_result: {
      required: [
        "id",
        "goal_id",
        "name",
        "type",
        "unit",
        "creator",
        "date_created",
        "goal_pretty_id",
        "percent_completed",
        "completed",
        "task_ids",
        "subcategory_ids",
        "owners",
        "last_action",
      ],
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        goal_id: {
          type: "string",
        },
        name: {
          type: "string",
        },
        type: {
          type: "string",
        },
        unit: {
          type: "string",
        },
        creator: {
          type: "integer",
        },
        date_created: {
          type: "string",
        },
        goal_pretty_id: {
          type: "string",
        },
        percent_completed: {
          anyOf: [
            {
              type: "string",
            },
            {
              type: "null",
            },
          ],
        },
        completed: {
          type: "boolean",
        },
        task_ids: {
          type: "array",
          items: {
            type: "string",
          },
        },
        subcategory_ids: {
          type: "array",
          items: {
            type: "string",
          },
        },
        owners: {
          type: "array",
          items: {
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
        },
        last_action: {
          required: [
            "id",
            "key_result_id",
            "userid",
            "date_modified",
            "steps_taken",
            "note",
            "steps_before",
            "steps_current",
          ],
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            key_result_id: {
              type: "string",
            },
            userid: {
              type: "integer",
            },
            date_modified: {
              type: "string",
            },
            steps_taken: {
              anyOf: [
                {
                  type: "string",
                },
                {
                  type: "null",
                },
              ],
            },
            note: {
              type: "string",
            },
            steps_before: {
              anyOf: [
                {
                  type: "string",
                },
                {
                  type: "null",
                },
              ],
            },
            steps_current: {
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
} as Type;

export default {
  name: "Create Key Result",
  description: "Creates create key result in ClickUp",
  category: "Goals",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { goal_id, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/goal/${goal_id}/key_result`;

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
