import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Workspaces
const inputSchema = {} as Record<string, AppBlockConfigField>;

// Output schema for List Workspaces
const outputSchema = {
  required: ["teams"],
  type: "object",
  properties: {
    teams: {
      type: "array",
      items: {
        required: ["id", "name", "color", "avatar", "members"],
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
          },
          color: {
            type: "string",
          },
          avatar: {
            type: "string",
          },
          members: {
            type: "array",
            items: {
              required: ["user"],
              type: "object",
              properties: {
                user: {
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
                    profilePicture: {
                      type: "string",
                    },
                    initials: {
                      type: "string",
                    },
                    week_start_day: {
                      type: "integer",
                      description:
                        "The user's preferred start of the calendar week setting. \\ `0` is Sunday. \\ `1` is Monday.",
                    },
                    global_font_support: {
                      type: "boolean",
                    },
                    timezeone: {
                      type: "string",
                    },
                  },
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
  name: "List Workspaces",
  description: "Retrieves list workspaces in ClickUp",
  category: "Authorization",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const endpoint = `/v2/team`;

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
