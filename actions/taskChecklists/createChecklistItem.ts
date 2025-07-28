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

// Input schema for Create Checklist Item
const inputSchema = {
  checklist_id: {
    name: "Checklist ID",
    description: "",
    type: "string",
    required: true,
  },
  assignee: {
    name: "Assignee",
    description: "The user ID to assign",
    type: "number",
    required: false,
  },
  name: {
    name: "Name",
    description: "The name",
    type: "string",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Create Checklist Item
const outputSchema = {
  required: ["checklist"],
  type: "object",
  properties: {
    checklist: {
      required: [
        "id",
        "task_id",
        "name",
        "date_created",
        "orderindex",
        "resolved",
        "unresolved",
        "items",
      ],
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        task_id: {
          type: "string",
        },
        name: {
          type: "string",
        },
        date_created: {
          type: "string",
        },
        orderindex: {
          type: "integer",
        },
        resolved: {
          type: "integer",
        },
        unresolved: {
          type: "integer",
        },
        items: {
          type: "array",
          items: {
            required: [
              "id",
              "name",
              "orderindex",
              "assignee",
              "resolved",
              "parent",
              "date_created",
              "children",
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
              assignee: {
                required: [
                  "id",
                  "username",
                  "email",
                  "color",
                  "initials",
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
                  email: {
                    type: "string",
                  },
                  color: {
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
              resolved: {
                type: "boolean",
              },
              parent: {
                anyOf: [
                  {
                    type: "string",
                  },
                  {
                    type: "null",
                  },
                ],
              },
              date_created: {
                type: "string",
              },
              children: {
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
  },
} as Type;

export default {
  name: "Create Checklist Item",
  description: "Creates create checklist item in ClickUp",
  category: "Task Checklists",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { checklist_id, ...inputData } = input.event.inputConfig;
        const endpoint = `/v2/checklist/${checklist_id}/checklist_item`;

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
