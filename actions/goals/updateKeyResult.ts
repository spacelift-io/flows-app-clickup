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

// Input schema for Update Key Result
const inputSchema = {
  key_result_id: {
    name: "Key Result ID",
    description: "",
    type: "string",
    required: true,
  },
  note: {
    name: "Note",
    description: "Additional note or comment",
    type: "string",
    required: true,
  },
  steps_current: {
    name: "Steps Current",
    description: "",
    type: "number",
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Update Key Result
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
            "steps_before_float",
            "steps_taken_float",
            "steps_current_float",
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
            steps_before_float: {
              type: "integer",
            },
            steps_taken_float: {
              type: "integer",
            },
            steps_current_float: {
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
  name: "Update Key Result",
  description: "Updates update key result in ClickUp",
  category: "Goals",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { key_result_id, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/key_result/${key_result_id}`;

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
