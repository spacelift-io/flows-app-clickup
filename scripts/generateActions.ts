import refParser from "@apidevtools/json-schema-ref-parser";
import schema from "../schema.json" with { type: "json" };
import { join } from "node:path";
import { writeFile, mkdir } from "node:fs/promises";
import { fieldDescriptions } from "./fieldDescriptionMap";
import { schemaDefinitions } from "./schemaDefinitions";
import { toCamelCase, fieldNameToDisplayName } from "./utils";
import type { JsonSchema } from "@slflows/sdk/v1";

// Configuration constants for schema processing
const UNUSED_PROPS = ["example", "examples", "title", "contentEncoding"];
const IGNORED_PARAMS = ["team_id"]; // Parameters to exclude from generated schemas

/**
 * Checks if a parameter should be ignored during schema generation.
 * Uses case-insensitive matching for flexibility.
 */
function isIgnoredParam(paramName: string): boolean {
  return IGNORED_PARAMS.some((ignored) =>
    paramName.toLowerCase().includes(ignored),
  );
}

/**
 * ClickUp Schema Generator
 *
 * This script processes the ClickUp OpenAPI schema and generates TypeScript action files
 * with embedded schemas. It performs several transformations:
 *
 * 1. Cleans and simplifies JSON schemas from OpenAPI format
 * 2. Converts snake_case to camelCase for TypeScript compatibility
 * 3. Generates user-friendly field descriptions and display names
 * 4. Creates organized directory structure by API category
 * 5. Generates a unified actions index for easy importing
 * 6. Embeds input/output schemas directly in TypeScript files
 *
 * ## Key Optimizations:
 * - Template-based code generation for better maintainability
 * - Data-driven configuration for special cases (ACTION_CONFIGS)
 * - Centralized parameter filtering (isIgnoredParam)
 * - Robust string escaping using JSON.stringify
 * - Simplified schema transformation using rule-based approach
 * - Efficient field sorting with single-pass algorithm
 */

// Configuration constants
const ACTIONS_DIR = "./actions";

await refParser.dereference(schema);

/**
 * Schema transformation rules for cleaning OpenAPI schemas.
 * Each rule is a pure function that transforms a schema node.
 */
type SchemaTransformRule = (node: any) => any;

const SCHEMA_TRANSFORM_RULES: Record<string, SchemaTransformRule> = {
  removeUnusedProps: (node: any) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return node;
    const result = { ...node };
    UNUSED_PROPS.forEach((prop) => delete result[prop]);
    return result;
  },

  cleanDescriptions: (node: any) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return node;
    const result = { ...node };
    if (typeof result.description === "string") {
      const desc = result.description.trim();
      if (/^\[.*\]\(doc:.*\)$/.test(desc) || desc === "") {
        delete result.description;
      }
    }
    return result;
  },

  convertUnionTypes: (node: any) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return node;
    const result = { ...node };
    if (Array.isArray(result.type)) {
      if (result.type.includes("null")) {
        const nonNullTypes = result.type.filter((t: string) => t !== "null");
        if (nonNullTypes.length === 1) {
          result.anyOf = [{ type: nonNullTypes[0] }, { type: "null" }];
        } else {
          result.anyOf = [
            ...nonNullTypes.map((t: string) => ({ type: t })),
            { type: "null" },
          ];
        }
      } else {
        result.anyOf = result.type.map((t: string) => ({ type: t }));
      }
      delete result.type;
    }
    return result;
  },
};

/**
 * Transforms a schema by applying a series of transformation rules recursively.
 * This replaces the complex nested cleaning functions with a clearer rule-based approach.
 */
function transformSchema(schema: any, rules: SchemaTransformRule[]): any {
  if (!schema || typeof schema !== "object") {
    return schema;
  }

  if (Array.isArray(schema)) {
    return schema.map((item) => transformSchema(item, rules));
  }

  let result = { ...schema };

  // Apply transformation rules
  for (const rule of rules) {
    result = rule(result);
  }

  // Recursively transform child nodes
  for (const key in result) {
    if (typeof result[key] === "object" && result[key] !== null) {
      result[key] = transformSchema(result[key], rules);
    }
  }

  return result;
}

function cleanSchema(obj: unknown): unknown {
  const rules = [
    SCHEMA_TRANSFORM_RULES.removeUnusedProps,
    SCHEMA_TRANSFORM_RULES.cleanDescriptions,
    SCHEMA_TRANSFORM_RULES.convertUnionTypes,
  ];
  return transformSchema(obj, rules);
}

function cleanOutputSchema(obj: unknown): unknown {
  const cleaned = cleanSchema(obj);
  return simplifySchemaTypes(cleaned);
}

function simplifySchemaTypes(schema: any): any {
  if (typeof schema !== "object" || schema === null) {
    return convertToAppropriateType(schema);
  }

  if (Array.isArray(schema)) {
    return schema.map((item) => simplifySchemaTypes(item));
  }

  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(schema)) {
    if (key === "properties") {
      // Preserve JsonSchema structure for properties
      result[key] = preserveSchemaStructure(value);
    } else {
      result[key] = simplifySchemaTypes(value);
    }
  }
  return convertToAppropriateType(result);
}

function preserveSchemaStructure(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => preserveSchemaStructure(item));
  }

  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = preserveSchemaStructure(value);
  }
  return result;
}

function _simplifyNullable(anyOf: any[]): string | null {
  // Handle single-item anyOf arrays
  if (anyOf.length === 1 && anyOf[0].type) {
    const singleType = anyOf[0].type;
    if (
      ["string", "number", "integer", "boolean", "null"].includes(singleType)
    ) {
      return singleType === "integer" ? "number" : singleType;
    }
  }

  // Handle two-item anyOf with null
  if (anyOf.length === 2 && anyOf.map((t) => t.type).includes("null")) {
    const nonNullType = anyOf
      .map((t) => t.type)
      .find((t: string) => t !== "null");
    if (
      nonNullType &&
      ["string", "number", "integer", "boolean"].includes(nonNullType)
    ) {
      return nonNullType === "integer" ? "number" : nonNullType;
    }
  }
  return null;
}

function _isSimpleSchema(schema: any): boolean {
  if (!schema || typeof schema !== "object") return false;
  const keys = Object.keys(schema);
  return keys.every((key) => key === "type" || key === "description");
}

function _simplifySimpleType(jsonSchemaType: any): string | null {
  if (
    jsonSchemaType.type &&
    typeof jsonSchemaType.type === "string" &&
    !jsonSchemaType.properties &&
    !jsonSchemaType.items &&
    !jsonSchemaType.anyOf &&
    !jsonSchemaType.oneOf &&
    !jsonSchemaType.enum &&
    _isSimpleSchema(jsonSchemaType)
  ) {
    return jsonSchemaType.type === "integer" ? "number" : jsonSchemaType.type;
  }
  return null;
}

function _simplifySimpleArray(jsonSchemaType: any): string[] | null {
  if (
    jsonSchemaType.type === "array" &&
    jsonSchemaType.items &&
    _isSimpleSchema(jsonSchemaType.items)
  ) {
    const itemType =
      jsonSchemaType.items.type === "integer"
        ? "number"
        : jsonSchemaType.items.type;
    return [itemType];
  }
  return null;
}

/**
 * Simplifies ClickUp's add/remove pattern for array fields.
 *
 * ClickUp often uses { add: [1,2,3], rem: [4,5,6] } patterns for array modifications.
 * For the app block interface, we simplify this to just ["number"] since users
 * will typically work with the final array values rather than incremental changes.
 */
function _simplifyAddRemArray(jsonSchemaType: any): string[] | null {
  if (
    jsonSchemaType.type === "object" &&
    jsonSchemaType.properties?.add?.type === "array" &&
    jsonSchemaType.properties?.rem?.type === "array" &&
    jsonSchemaType.properties.add.items?.type === "integer" &&
    jsonSchemaType.properties.rem.items?.type === "integer" &&
    Object.keys(jsonSchemaType.properties).length === 2
  ) {
    return ["number"];
  }
  return null;
}

function convertToAppropriateType(jsonSchemaType: any): any {
  if (typeof jsonSchemaType === "string") {
    return jsonSchemaType === "integer" ? "number" : jsonSchemaType;
  }

  if (jsonSchemaType && typeof jsonSchemaType === "object") {
    if (jsonSchemaType.anyOf && Array.isArray(jsonSchemaType.anyOf)) {
      const simplified = _simplifyNullable(jsonSchemaType.anyOf);
      if (simplified) return simplified;
    }

    const simpleType = _simplifySimpleType(jsonSchemaType);
    if (simpleType) return simpleType;

    const simpleArray = _simplifySimpleArray(jsonSchemaType);
    if (simpleArray) return simpleArray;

    const addRemArray = _simplifyAddRemArray(jsonSchemaType);
    if (addRemArray) return addRemArray;
  }

  return jsonSchemaType as JsonSchema;
}

/**
 * Gets a meaningful description for a field, prioritizing manually curated descriptions
 * over potentially useless auto-generated ones from the OpenAPI spec
 */
function getFieldDescription(
  fieldName: string,
  existingDescription?: string,
): string {
  // Always prioritize our curated descriptions first
  const curatedDescription = fieldDescriptions[fieldName];
  if (curatedDescription) {
    return curatedDescription;
  }

  // Use existing description if it exists and appears meaningful
  if (existingDescription) {
    const desc = existingDescription.trim().replace(/\s+/g, " ");

    // Skip descriptions that are clearly auto-generated examples or placeholders
    const isUselessPattern =
      /^[a-f0-9-]+ \(uuid\)$/i.test(desc) || // Consolidated UUID patterns
      /^\d+ \((?:string|number|integer)\)$/.test(desc) || // Type examples
      desc.length < 10; // Very short descriptions

    if (!isUselessPattern) {
      return desc;
    }
  }

  return "";
}

function convertJsonSchemaToAppBlockConfig(
  jsonSchema: any,
): Record<string, any> {
  const config: Record<string, any> = {};
  if (!jsonSchema.properties) {
    return config;
  }

  const requiredSet = new Set(jsonSchema.required || []);
  const allFieldNames = Object.keys(jsonSchema.properties).sort((a, b) => {
    const aIsRequired = requiredSet.has(a);
    const bIsRequired = requiredSet.has(b);
    if (aIsRequired !== bIsRequired) {
      return aIsRequired ? -1 : 1; // Required fields first
    }
    return a.localeCompare(b); // Then sort alphabetically
  });

  for (const fieldName of allFieldNames) {
    const fieldSchema = jsonSchema.properties[fieldName];
    const isRequired = requiredSet.has(fieldName);

    config[fieldName] = {
      name: fieldNameToDisplayName(fieldName),
      description: getFieldDescription(
        fieldName,
        (fieldSchema as any).description,
      ),
      type: convertToAppropriateType(fieldSchema),
      required: isRequired,
    };
  }

  return config;
}

function _processParameters(
  parameters: any[],
  paramIn: "path" | "query",
  properties: Record<string, any>,
  required: string[],
) {
  if (!parameters) return;

  parameters.forEach((param: any) => {
    if (param.in === paramIn && !isIgnoredParam(param.name)) {
      const paramSchema = param.schema || { type: "string" };
      if (param.description) {
        paramSchema.description = param.description;
      }
      properties[param.name] = paramSchema;
      if (param.required) {
        required.push(param.name);
      }
    }
  });
}

function getInputSchema(path: string, method: string) {
  const endpoint = (schema.paths as any)[path];
  if (!endpoint || !endpoint[method]) {
    return {};
  }

  const operation = endpoint[method];
  const properties: Record<string, any> = {};
  const required: string[] = [];

  // Process path and query parameters
  _processParameters(operation.parameters, "path", properties, required);
  _processParameters(operation.parameters, "query", properties, required);

  // Add request body properties
  if (
    operation.requestBody?.content?.["application/json"]?.schema?.properties
  ) {
    const bodySchema = operation.requestBody.content["application/json"].schema;
    Object.entries(bodySchema.properties).forEach(([key, value]) => {
      if (!isIgnoredParam(key)) {
        properties[key] = value;
      }
    });

    if (bodySchema.required) {
      bodySchema.required.forEach((field: string) => {
        if (!isIgnoredParam(field)) {
          required.push(field);
        }
      });
    }
  }

  return {
    type: "object",
    properties,
    ...(required.length > 0 ? { required } : {}),
  };
}

function parseEndpoint(endpoint: string): { path: string; method: string } {
  const [method, path] = endpoint.split(" ");
  return { path, method: method.toLowerCase() };
}

/**
 * Converts a JavaScript object to a TypeScript object literal string
 */
function objectToTsString(obj: any, indent = 0): string {
  if (obj === null) return "null";
  if (typeof obj === "string") {
    // Use JSON.stringify for robust string escaping
    return `"${JSON.stringify(obj).slice(1, -1)}"`;
  }
  if (typeof obj === "number" || typeof obj === "boolean") return String(obj);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    const items = obj.map((item) => objectToTsString(item, indent + 2));
    return `[\n${" ".repeat(indent + 2)}${items.join(`,\n${" ".repeat(indent + 2)}`)}\n${" ".repeat(indent)}]`;
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj);
    if (entries.length === 0) return "{}";
    const props = entries.map(([key, value]) => {
      const quotedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
        ? key
        : `"${key}"`;
      return `${" ".repeat(indent + 2)}${quotedKey}: ${objectToTsString(value, indent + 2)}`;
    });
    return `{\n${props.join(",\n")}\n${" ".repeat(indent)}}`;
  }
  return "undefined";
}

function extractPathParams(path: string): string[] {
  const matches = path.match(/{([^}]+)}/g);
  return matches ? matches.map((match) => match.slice(1, -1)) : [];
}

function needsCustomTaskIds(actionName: string, pathParams: string[]): boolean {
  // Actions that work with tasks and might need custom_task_ids parameter
  return (
    actionName.toLowerCase().includes("task") ||
    pathParams.includes("task_id") ||
    actionName.toLowerCase().includes("comment")
  ); // Comments can be on tasks
}

/**
 * Template data interface for action file generation.
 * Separates data preparation from template rendering for better maintainability.
 */
interface ActionTemplateData {
  actionName: string;
  description: string;
  category: string;
  imports: string;
  inputSchemaTs: string;
  outputSchemaTs: string;
  destructureString: string;
  urlConstruction: string;
  methodOptions: string;
}

/**
 * Template function for generating TypeScript action files.
 * This approach separates the template structure from the complex logic
 * that was previously embedded in string concatenation.
 */
function generateActionFileTemplate(data: ActionTemplateData): string {
  const {
    actionName,
    description,
    category,
    imports,
    inputSchemaTs,
    outputSchemaTs,
    destructureString,
    urlConstruction,
    methodOptions,
  } = data;

  return `import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
  Type,
} from "@slflows/sdk/v1";
${imports}

// Input schema for ${fieldNameToDisplayName(actionName)}
const inputSchema = ${inputSchemaTs} as Record<string, AppBlockConfigField>;

// Output schema for ${fieldNameToDisplayName(actionName)}
const outputSchema = ${outputSchemaTs} as Type;

export default {
  name: "${fieldNameToDisplayName(actionName)}",
  description: "${description}",
  category: "${category}",

  inputs: {
    default: {
      config: inputSchema as Record<string, AppBlockConfigField>,
      onEvent: async (input: EventInput) => {
        ${destructureString}${urlConstruction}

        await events.emit(
          await makeClickUpApiRequest(
            input.app.signals.accessToken!,
            endpoint,
            ${methodOptions}
          )
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
`;
}

/**
 * Generates a complete TypeScript action file by preparing template data
 * and rendering it through the template function. This refactored approach
 * makes the code much more maintainable than the previous string concatenation.
 */
function generateActionFile(
  actionName: string,
  path: string,
  method: string,
  category: string,
  inputSchema: any,
  outputSchema: any,
): string {
  const httpMethod = method.toUpperCase();
  const pathParams = extractPathParams(path);
  const needsCustomTaskIdsParam = needsCustomTaskIds(actionName, pathParams);
  const hasBody = ["post", "put", "patch"].includes(method.toLowerCase());

  // Convert path to template literal format, handling team_id specially
  let pathTemplate = path.replace(/{([^}]+)}/g, "${$1}");
  pathTemplate = pathTemplate.replace(
    "${team_id}",
    "${input.app.signals.teamId}",
  );

  // Determine what parameters to destructure
  const destructureParams = pathParams.filter((param) => param !== "team_id");
  if (needsCustomTaskIdsParam) {
    destructureParams.push("custom_task_ids");
  }

  // Build destructure string
  let destructureString = "";
  if (destructureParams.length > 0 && hasBody) {
    destructureString = `const { ${destructureParams.join(", ")}, ...inputData } = input.event.inputConfig;`;
  } else if (destructureParams.length > 0) {
    destructureString = `const { ${destructureParams.join(", ")} } = input.event.inputConfig;`;
  } else if (hasBody) {
    destructureString = `const inputData = input.event.inputConfig;`;
  }

  // Build URL construction logic
  const urlConstruction = needsCustomTaskIdsParam
    ? `
        const params = new URLSearchParams();
        if (custom_task_ids) {
          params.append("custom_task_ids", "true");
          params.append("team_id", input.app.signals.teamId);
        }

        const queryString = params.toString();
        const endpoint = queryString
          ? \`${pathTemplate}?\${queryString}\`
          : \`${pathTemplate}\`;`
    : `
        const endpoint = \`${pathTemplate}\`;`;

  // Build method options and imports
  const methodOptions = hasBody
    ? `{\n              method: "${httpMethod}",\n              body: filterDefinedParams(inputData),\n            }`
    : `{ method: "${httpMethod}" }`;

  const imports = hasBody
    ? `import { makeClickUpApiRequest, filterDefinedParams } from "../../utils/apiHelpers.ts";`
    : `import { makeClickUpApiRequest } from "../../utils/apiHelpers.ts";`;

  // Generate operation description
  const operationMap: Record<string, string> = {
    get: "Retrieves",
    post: "Creates",
    put: "Updates",
    delete: "Deletes",
  };
  const operation = operationMap[method] || "Manages";
  const description = `${operation} ${fieldNameToDisplayName(actionName).toLowerCase()} in ClickUp`;

  // Prepare template data
  const templateData: ActionTemplateData = {
    actionName,
    description,
    category,
    imports,
    inputSchemaTs: objectToTsString(inputSchema),
    outputSchemaTs: objectToTsString(outputSchema),
    destructureString,
    urlConstruction,
    methodOptions,
  };

  return generateActionFileTemplate(templateData);
}

async function writeActionFile(
  category: string,
  actionName: string,
  content: string,
): Promise<void> {
  const fileName = `${actionName}.ts`;
  const filePath = `${ACTIONS_DIR}/${category}/${fileName}`;
  const fullDirPath = join(process.cwd(), `${ACTIONS_DIR}/${category}`);

  // Ensure directory exists
  await mkdir(fullDirPath, { recursive: true });
  await writeFile(join(process.cwd(), filePath), content);
  console.log(`Generated action: ${filePath}`);
}

/**
 * Configuration for special cases - makes the generator more data-driven.
 * Instead of hardcoding special logic throughout the code, we centralize
 * action-specific configurations here.
 */
interface ActionConfig {
  successCode?: string;
  needsCustomTaskIds?: boolean;
}

const ACTION_CONFIGS: Record<string, ActionConfig> = {
  deleteTask: { successCode: "204" },
  // Add more action-specific configs here as needed
};

/**
 * Gets configuration for a specific action, with sensible defaults.
 */
function getActionConfig(actionName: string): ActionConfig {
  return ACTION_CONFIGS[actionName] || {};
}

async function generateActionWithSchemas(
  actionName: string,
  path: string,
  method: string,
  category: string,
) {
  // Find the operation in the OpenAPI schema
  const endpoint = (schema.paths as any)[path];
  if (!endpoint || !endpoint[method]) {
    console.warn(`Could not find operation for ${path} ${method}`);
    return;
  }

  // Get action-specific configuration
  const actionConfig = getActionConfig(actionName);
  const statusCode = actionConfig.successCode || "200";

  const outputSchemaRaw = (schema.paths as any)[path]?.[method]?.responses?.[
    statusCode
  ]?.content?.["application/json"]?.schema;

  const outputSchema = outputSchemaRaw
    ? cleanOutputSchema(outputSchemaRaw)
    : {};

  // Generate input schema
  const inputSchemaNode = getInputSchema(path, method);
  const inputSchema =
    !inputSchemaNode || Object.keys(inputSchemaNode).length === 0
      ? {}
      : convertJsonSchemaToAppBlockConfig(cleanSchema(inputSchemaNode));

  // Generate consolidated action TypeScript file with embedded schemas
  const actionContent = generateActionFile(
    actionName,
    path,
    method,
    category,
    inputSchema,
    outputSchema,
  );
  await writeActionFile(toCamelCase(category), actionName, actionContent);
}

async function generateActionsIndex(
  actionsByCategory: Record<string, string[]>,
) {
  const imports: string[] = [];
  const allActions: string[] = [];

  // Sort categories for consistent output
  const sortedCategories = Object.keys(actionsByCategory).sort();

  for (const category of sortedCategories) {
    const actions = actionsByCategory[category].sort();

    // Generate imports for each action in this category using default imports
    for (const actionName of actions) {
      imports.push(
        `import ${actionName} from "./${toCamelCase(category)}/${actionName}.ts";`,
      );
      allActions.push(`  ${actionName}`);
    }
  }

  // Generate a single export object with all actions
  const exportObject = `export const actions = {\n${allActions.join(",\n")},\n};`;

  // Generate the complete index file content
  const indexContent = `${imports.join("\n")}\n\n${exportObject}\n`;

  const indexPath = `${ACTIONS_DIR}/index.ts`;
  await writeFile(join(process.cwd(), indexPath), indexContent);
  console.log(`Generated actions index: ${indexPath}`);
}

// Keep track of actions by category for index generation
const actionsByCategory: Record<string, string[]> = {};

// Generate consolidated actions with embedded schemas
for (const [actionName, endpointString] of Object.entries(schemaDefinitions)) {
  const { path, method } = parseEndpoint(endpointString);

  // Find the operation in the OpenAPI schema to get tags
  const endpoint = (schema.paths as any)[path];
  if (
    endpoint &&
    endpoint[method] &&
    endpoint[method].tags &&
    endpoint[method].tags.length > 0
  ) {
    const category = endpoint[method].tags[0];
    if (!actionsByCategory[category]) {
      actionsByCategory[category] = [];
    }
    actionsByCategory[category].push(actionName);

    // Generate action with embedded schemas
    await generateActionWithSchemas(actionName, path, method, category);
  }
}

// Generate the main actions index file
await generateActionsIndex(actionsByCategory);
