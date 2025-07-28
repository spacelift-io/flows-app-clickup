/**
 * Filters out undefined values from an object, keeping only defined parameters
 * This prevents sending undefined values to the ClickUp API
 */
export function filterDefinedParams(
  obj: Record<string, any>,
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Makes authenticated HTTP request to ClickUp API using access token
 */
export async function makeClickUpApiRequest(
  accessToken: string,
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
  } = {},
): Promise<any> {
  const { method = "GET", body, headers = {}, params } = options;

  // Build URL with query parameters
  const url = new URL(`https://api.clickup.com/api${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Prepare request headers
  const requestHeaders: Record<string, string> = {
    Authorization: accessToken,
    "Content-Type": "application/json",
    ...headers,
  };

  // Prepare request body
  const requestBody = body ? JSON.stringify(body) : undefined;

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: requestHeaders,
      body: requestBody,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        `ClickUp API error: ${response.status} ${response.statusText} - ${
          responseData.err || responseData.ECODE || "Unknown error"
        }`,
      );
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`ClickUp API request failed: ${String(error)}`);
  }
}

export async function getAccessToken(
  baseUrl: string,
  clientId: string,
  clientSecret: string,
  code: string,
) {
  const response = await fetch(`${baseUrl}/v2/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      `ClickUp OAuth error: ${response.status} ${response.statusText} - ${
        responseData.err || responseData.ECODE || "Unknown error"
      }`,
    );
  }

  return responseData;
}
