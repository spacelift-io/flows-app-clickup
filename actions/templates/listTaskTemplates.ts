import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Task Templates
const inputSchema = {
  page: {
    name: "Page",
    description: "Page number for pagination",
    type: {
      type: "integer",
    },
    required: true,
  },
  custom_task_ids: {
    name: "Custom Task IDs",
    description:
      "If you want to reference a task by its custom task id, this value must be `true`.",
    type: "boolean",
    required: false,
  },
} as Record<string, AppBlockInputConfigField>;

// Output schema for List Task Templates
const outputSchema = {
  required: ["templates"],
  type: "object",
  properties: {
    templates: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  additionalProperties: true,
} as Type;

export default {
  name: "List Task Templates",
  description: "Retrieves list task templates in ClickUp",
  category: "Templates",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { custom_task_ids } = input.event.inputConfig;
        const params = new URLSearchParams();
        if (custom_task_ids) {
          params.append("custom_task_ids", "true");
          params.append("team_id", input.app.signals.teamId);
        }

        const queryString = params.toString();
        const endpoint = queryString
          ? `/v2/team/${input.app.signals.teamId}/taskTemplate?${queryString}`
          : `/v2/team/${input.app.signals.teamId}/taskTemplate`;

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
