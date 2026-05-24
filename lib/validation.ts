/**
 * Pure input validation helpers for the email-text field.
 *
 * Separated from React components so they're trivially unit-testable
 * and easy to extend (add new rules without re-rendering the UI).
 */

export const MIN_EMAIL_LENGTH = 10;
export const MAX_EMAIL_LENGTH = 50_000; // ~12k tokens, safely under Gemini context limits

export type ValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

/**
 * Validate raw email text before sending to Gemini.
 *
 * Catches the obvious failure modes (empty, way too long, only whitespace)
 * locally so we don't waste an API call on garbage input.
 */
export function validateEmailText(text: string): ValidationResult {
  if (typeof text !== "string") {
    return { ok: false, reason: "Email content must be text." };
  }

  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return { ok: false, reason: "Email content cannot be empty." };
  }

  if (trimmed.length < MIN_EMAIL_LENGTH) {
    return {
      ok: false,
      reason: `Email is too short to analyze (need at least ${MIN_EMAIL_LENGTH} characters).`,
    };
  }

  if (text.length > MAX_EMAIL_LENGTH) {
    return {
      ok: false,
      reason: `Email is too long (${text.length.toLocaleString()} chars; max ${MAX_EMAIL_LENGTH.toLocaleString()}). Trim it or paste a section.`,
    };
  }

  return { ok: true };
}

/**
 * Character-counter helper for the input UI.
 *
 * Returns a tuple of (current, max, severity) where severity is:
 *   - "ok"      — comfortably under the limit
 *   - "warn"    — within 10% of the limit
 *   - "error"   — at or over the limit
 */
export function getLengthMeter(
  text: string,
): { current: number; max: number; severity: "ok" | "warn" | "error" } {
  const current = text.length;
  const max = MAX_EMAIL_LENGTH;
  let severity: "ok" | "warn" | "error" = "ok";
  if (current >= max) severity = "error";
  else if (current >= max * 0.9) severity = "warn";
  return { current, max, severity };
}
