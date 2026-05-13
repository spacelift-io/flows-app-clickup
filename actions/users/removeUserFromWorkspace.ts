import {
  AppBlock,
  events,
  EventInput,
  AppBlockInputConfigField,
  Type,
} from "@slflows/sdk/v1";
import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Remove User From Workspace
const inputSchema = {
  user_id: {
    name: "User ID",
    description: "",
    type: "number",
    required: true,
  },
} as Record<string, AppBlockInputConfigField>;

// Output schema for Remove User From Workspace
const outputSchema = {
  required: ["team"],
  type: "object",
  properties: {
    team: {
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
          anyOf: [
            {
              type: "string",
            },
            {
              type: "null",
            },
          ],
        },
        members: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      additionalProperties: true,
    },
  },
  additionalProperties: true,
} as Type;

export default {
  name: "Remove User From Workspace",
  description: "Deletes remove user from workspace in ClickUp",
  category: "Users",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { user_id } = input.event.inputConfig;
        const endpoint = `/v2/team/${input.app.signals.teamId}/user/${user_id}`;

        await events.emit(
          await makeClickUpApiRequest(
            input.app.signals.accessToken!,
            endpoint,
            { method: "DELETE" },
          ),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
