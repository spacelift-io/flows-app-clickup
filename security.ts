import { createHmac, timingSafeEqual } from "node:crypto";

export interface WebhookVerificationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Verifies ClickUp webhook signature for security.
 * ClickUp signs webhooks using HMAC-SHA256 with the webhook secret.
 * Note: ClickUp does not send timestamps, just signs the raw body.
 */
export function verifyClickUpWebhook(
  signature: string,
  rawBody: string,
  secret: string,
): WebhookVerificationResult {
  try {
    if (!signature || !secret) {
      return {
        isValid: false,
        error: "Missing signature or secret",
      };
    }

    // Create expected signature
    // ClickUp format: HMAC-SHA256(body, secret)
    const expectedSignature = createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("hex");

    // Extract hex signature from header (remove 'sha256=' prefix if present)
    const providedSignature = signature.startsWith("sha256=")
      ? signature.slice(7)
      : signature;

    // Use timing-safe comparison to prevent timing attacks
    const isValid = timingSafeEqual(
      Buffer.from(providedSignature, "hex"),
      Buffer.from(expectedSignature, "hex"),
    );

    return {
      isValid,
      error: isValid ? undefined : "Invalid signature",
    };
  } catch (error) {
    return {
      isValid: false,
      error: `Verification failed: ${(error as Error).message}`,
    };
  }
}
