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

// Input schema for Set Custom Field Value
const inputSchema = {
  field_id: {
    name: "Field ID",
    description:
      "Enter the universal unique identifier (UUID) of the Custom Field you want to set.",
    type: "string",
    required: true,
  },
  task_id: {
    name: "Task ID",
    description: "Enter the task ID of the task you want to update.",
    type: "string",
    required: true,
  },
  custom_task_ids: {
    name: "Custom Task IDs",
    description:
      "If you want to reference a task by its Custom Task ID, this value must be `true`.",
    type: "boolean",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Set Custom Field Value
const outputSchema = {
  type: "object",
  contentMediaType: "application/json",
} as Type;

export default {
  name: "Set Custom Field Value",
  description: "Creates set custom field value in ClickUp",
  category: "Custom Fields",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { task_id, field_id, custom_task_ids, ...inputData } =
          input.event.inputConfig;
        const params = new URLSearchParams();
        if (custom_task_ids) {
          params.append("custom_task_ids", "true");
          params.append("team_id", input.app.signals.teamId);
        }

        const queryString = params.toString();
        const endpoint = queryString
          ? `/v2/task/${task_id}/field/${field_id}?${queryString}`
          : `/v2/task/${task_id}/field/${field_id}`;

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
