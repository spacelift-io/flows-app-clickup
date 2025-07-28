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

// Input schema for Create Comment
const inputSchema = {
  comment_text: {
    name: "Comment Text",
    description: "",
    type: "string",
    required: true,
  },
  notify_all: {
    name: "Notify All",
    description:
      "If `notify_all` is true, notifications will be sent to everyone including the creator of the comment.",
    type: "boolean",
    required: true,
  },
  task_id: {
    name: "Task ID",
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
  custom_task_ids: {
    name: "Custom Task IDs",
    description:
      "If you want to reference a task by it's custom task id, this value must be `true`.",
    type: "boolean",
    required: false,
  },
  group_assignee: {
    name: "Group Assignee",
    description: "",
    type: "string",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Create Comment
const outputSchema = {
  required: ["id", "hist_id", "date"],
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    hist_id: {
      type: "string",
    },
    date: {
      type: "integer",
    },
  },
} as Type;

export default {
  name: "Create Comment",
  description: "Creates create comment in ClickUp",
  category: "Comments",

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
          ? `/v2/task/${task_id}/comment?${queryString}`
          : `/v2/task/${task_id}/comment`;

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
