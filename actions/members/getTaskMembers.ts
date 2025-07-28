import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Task Members
const inputSchema = {
  task_id: {
    name: "Task ID",
    description: "",
    type: "string",
    required: true,
  },
} as Record<string, AppBlockConfigField>;

// Output schema for Get Task Members
const outputSchema = {
  required: ["members"],
  type: "object",
  properties: {
    members: {
      type: "array",
      items: {
        required: [
          "id",
          "username",
          "email",
          "color",
          "initials",
          "profilePicture",
          "profileInfo",
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
            anyOf: [
              {
                type: "string",
              },
              {
                type: "null",
              },
            ],
          },
          initials: {
            type: "string",
          },
          profilePicture: {
            type: "string",
          },
          profileInfo: {
            required: [
              "display_profile",
              "verified_ambassador",
              "verified_consultant",
              "top_tier_user",
              "viewed_verified_ambassador",
              "viewed_verified_consultant",
              "viewed_top_tier_user",
            ],
            type: "object",
            properties: {
              display_profile: {
                anyOf: [
                  {
                    type: "string",
                  },
                  {
                    type: "null",
                  },
                ],
              },
              verified_ambassador: {
                anyOf: [
                  {
                    type: "string",
                  },
                  {
                    type: "null",
                  },
                ],
              },
              verified_consultant: {
                anyOf: [
                  {
                    type: "string",
                  },
                  {
                    type: "null",
                  },
                ],
              },
              top_tier_user: {
                anyOf: [
                  {
                    type: "string",
                  },
                  {
                    type: "null",
                  },
                ],
              },
              viewed_verified_ambassador: {
                anyOf: [
                  {
                    type: "string",
                  },
                  {
                    type: "null",
                  },
                ],
              },
              viewed_verified_consultant: {
                anyOf: [
                  {
                    type: "string",
                  },
                  {
                    type: "null",
                  },
                ],
              },
              viewed_top_tier_user: {
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
  },
} as Type;

export default {
  name: "Get Task Members",
  description: "Retrieves get task members in ClickUp",
  category: "Members",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const { task_id, custom_task_ids } = input.event.inputConfig;
        const params = new URLSearchParams();
        if (custom_task_ids) {
          params.append("custom_task_ids", "true");
          params.append("team_id", input.app.signals.teamId);
        }

        const queryString = params.toString();
        const endpoint = queryString
          ? `/v2/task/${task_id}/member?${queryString}`
          : `/v2/task/${task_id}/member`;

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
