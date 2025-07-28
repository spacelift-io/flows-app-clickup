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

// Input schema for Add Tag To Task
const inputSchema = {
  tag_name: {
    name: "Tag Name",
    description: "",
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

// Output schema for Add Tag To Task
const outputSchema = {
  type: "object",
  contentMediaType: "application/json",
} as Type;

export default {
  name: "Add Tag To Task",
  description: "Creates add tag to task in ClickUp",
  category: "Tags",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { task_id, tag_name, custom_task_ids, ...inputData } =
          input.event.inputConfig;
        const params = new URLSearchParams();
        if (custom_task_ids) {
          params.append("custom_task_ids", "true");
          params.append("team_id", input.app.signals.teamId);
        }

        const queryString = params.toString();
        const endpoint = queryString
          ? `/v2/task/${task_id}/tag/${tag_name}?${queryString}`
          : `/v2/task/${task_id}/tag/${tag_name}`;

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
