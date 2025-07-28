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

// Input schema for Update Checklist Item
const inputSchema = {
  checklist_id: {
    name: "Checklist ID",
    description: "",
    type: "string",
    required: true,
  },
  checklist_item_id: {
    name: "Checklist Item ID",
    description: "",
    type: "string",
    required: true,
  },
  assignee: {
    name: "Assignee",
    description: "The user ID to assign",
    type: "string",
    required: false,
  },
  name: {
    name: "Name",
    description: "The name",
    type: "string",
    required: false,
  },
  parent: {
    name: "Parent",
    description: "Parent task ID for creating subtasks",
    type: "string",
    required: false,
  },
  resolved: {
    name: "Resolved",
    description: "Whether the item is resolved",
    type: "boolean",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Update Checklist Item
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
                anyOf: [
                  {
                    type: "string",
                  },
                  {
                    type: "null",
                  },
                ],
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
  name: "Update Checklist Item",
  description: "Updates update checklist item in ClickUp",
  category: "Task Checklists",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { checklist_id, checklist_item_id, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/v2/checklist/${checklist_id}/checklist_item/${checklist_item_id}`;

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
