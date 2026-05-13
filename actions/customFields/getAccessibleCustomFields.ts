import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Accessible Custom Fields
const inputSchema = {
  list_id: {
    name: "List ID",
    description: "",
    type: "number",
    required: true,
  },
} as Record<string, AppBlockInputConfigField>;

// Output schema for Get Accessible Custom Fields
const outputSchema = {
  required: ["fields"],
  type: "object",
  properties: {
    fields: {
      type: "array",
      items: {
        required: [
          "id",
          "name",
          "type",
          "type_config",
          "date_created",
          "hide_from_guests",
        ],
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
          },
          type: {
            type: "string",
          },
          type_config: {
            type: "object",
            properties: {
              options: {
                type: "array",
                items: {
                  required: ["id", "color"],
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    label: {
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
                    name: {
                      type: "string",
                    },
                    value: {
                      type: "integer",
                    },
                    type: {
                      type: "string",
                    },
                    orderindex: {
                      type: "integer",
                    },
                  },
                  additionalProperties: true,
                },
              },
              default: {
                oneOf: [
                  {
                    anyOf: [
                      {
                        type: "string",
                      },
                      {
                        type: "null",
                      },
                    ],
                  },
                  {
                    type: "integer",
                  },
                  {},
                ],
              },
              precision: {
                type: "integer",
              },
              currency_type: {
                type: "string",
              },
              placeholder: {
                anyOf: [
                  {
                    type: "string",
                  },
                  {
                    type: "null",
                  },
                ],
              },
              end: {
                type: "integer",
              },
              start: {
                type: "integer",
              },
              count: {
                type: "integer",
              },
              code_point: {
                type: "string",
              },
              tracking: {
                required: ["subtasks", "checklists", "assigned_comments"],
                type: "object",
                properties: {
                  subtasks: {
                    type: "boolean",
                  },
                  checklists: {
                    type: "boolean",
                  },
                  assigned_comments: {
                    type: "boolean",
                  },
                },
                additionalProperties: true,
              },
              complete_on: {
                type: "integer",
              },
            },
            additionalProperties: true,
          },
          date_created: {
            type: "string",
          },
          hide_from_guests: {
            type: "boolean",
          },
        },
        additionalProperties: true,
      },
    },
  },
  additionalProperties: true,
} as Type;

export default {
  name: "Get Accessible Custom Fields",
  description: "Retrieves get accessible custom fields in ClickUp",
  category: "Custom Fields",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { list_id } = input.event.inputConfig;
        const endpoint = `/v2/list/${list_id}/field`;

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
