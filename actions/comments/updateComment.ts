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

// Input schema for Update Comment
const inputSchema = {
  assignee: {
    name: "Assignee",
    description: "The user ID to assign",
    type: "number",
    required: true,
  },
  comment_id: {
    name: "Comment ID",
    description: "",
    type: "number",
    required: true,
  },
  comment_text: {
    name: "Comment Text",
    description: "",
    type: "string",
    required: true,
  },
  resolved: {
    name: "Resolved",
    description: "Whether the item is resolved",
    type: "boolean",
    required: true,
  },
  group_assignee: {
    name: "Group Assignee",
    description: "",
    type: "string",
    required: false,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Update Comment
const outputSchema = {
  type: "object",
  contentMediaType: "application/json",
} as Type;

export default {
  name: "Update Comment",
  description: "Updates update comment in ClickUp",
  category: "Comments",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { comment_id, custom_task_ids, ...inputData } =
          input.event.inputConfig;
        const params = new URLSearchParams();
        if (custom_task_ids) {
          params.append("custom_task_ids", "true");
          params.append("team_id", input.app.signals.teamId);
        }

        const queryString = params.toString();
        const endpoint = queryString
          ? `/v2/comment/${comment_id}?${queryString}`
          : `/v2/comment/${comment_id}`;

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
