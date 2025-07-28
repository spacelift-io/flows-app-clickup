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

// Input schema for Create Checklist
const inputSchema = {
  name: {
    name: "Name",
    description: "The name",
    type: "string",
    required: true,
  },
  task_id: {
    name: "Task ID",
    description: "",
    type: "string",
    required: true,
  },
  custom_task_ids: {
    name: "Custom Task IDs",
    description:
      "If you want to reference a task by it's custom task id, this value must be `true`.",
    type: "boolean",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Create Checklist
const outputSchema = {
  required: ["checklist"],
  type: "object",
  properties: {
    checklist: {
      required: [
        "id",
        "task_id",
        "name",
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
            type: "string",
          },
        },
      },
    },
  },
} as Type;

export default {
  name: "Create Checklist",
  description: "Creates create checklist in ClickUp",
  category: "Task Checklists",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { task_id, custom_task_ids, ...inputData } =
          input.event.inputConfig;
        const params = new URLSearchParams();
        if (custom_task_ids) {
          params.append("custom_task_ids", "true");
          params.append("team_id", input.app.signals.teamId);
        }

        const queryString = params.toString();
        const endpoint = queryString
          ? `/v2/task/${task_id}/checklist?${queryString}`
          : `/v2/task/${task_id}/checklist`;

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
