/**
 * Typed error classes for the service layer.
 *
 * Lets components distinguish "you sent bad input" from "the API was rate
 * limited" from "the API key is missing" and show targeted UI for each.
 */

export class AnalysisError extends Error {
  constructor(
    message: string,
    readonly hint?: string,
  ) {
    super(message);
    this.name = "AnalysisError";
  }
}

export class MissingApiKeyError extends AnalysisError {
  constructor() {
    super(
      "Gemini API key is not configured.",
      "Set GEMINI_API_KEY in a .env.local file (copy .env.example as a starting point) and restart `npm run dev`.",
    );
    this.name = "MissingApiKeyError";
  }
}

export class RateLimitError extends AnalysisError {
  constructor() {
    super(
      "Gemini rate limit reached.",
      "Wait a few seconds and try again. Free-tier limits reset every minute.",
    );
    this.name = "RateLimitError";
  }
}

export class NetworkError extends AnalysisError {
  constructor(cause?: unknown) {
    super(
      "Couldn't reach Gemini.",
      "Check your internet connection. If this persists, the Gemini API may be having an outage.",
    );
    this.name = "NetworkError";
    if (cause) (this as { cause?: unknown }).cause = cause;
  }
}

/**
 * Convert any thrown value into a typed AnalysisError.
 *
 * Gemini SDK throws plain Error instances with status codes embedded in
 * the message. We pattern-match those into typed errors here so the UI
 * doesn't have to grep error strings.
 */
export function classifyError(err: unknown): AnalysisError {
  if (err instanceof AnalysisError) return err;

  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();

  if (lower.includes("api key") || lower.includes("api_key")) {
    return new MissingApiKeyError();
  }
  if (lower.includes("rate limit") || lower.includes("429") || lower.includes("quota")) {
    return new RateLimitError();
  }
  if (lower.includes("fetch") || lower.includes("network") || lower.includes("econnrefused")) {
    return new NetworkError(err);
  }

  return new AnalysisError(`Analysis failed: ${msg}`);
}
