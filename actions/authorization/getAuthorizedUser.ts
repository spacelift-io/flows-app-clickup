import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Authorized User
const inputSchema = {} as Record<string, AppBlockConfigField>;

// Output schema for Get Authorized User
const outputSchema = {
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
} as Type;

export default {
  name: "Get Authorized User",
  description: "Retrieves get authorized user in ClickUp",
  category: "Authorization",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        const endpoint = `/v2/user`;

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
