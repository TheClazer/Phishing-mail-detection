import { describe, expect, it } from "vitest";

import {
  getLengthMeter,
  MAX_EMAIL_LENGTH,
  MIN_EMAIL_LENGTH,
  validateEmailText,
} from "../lib/validation";

describe("validateEmailText", () => {
  it("accepts a realistic email", () => {
    const r = validateEmailText("Hello, please verify your account at example.com");
    expect(r.ok).toBe(true);
  });

  it("rejects empty string", () => {
    const r = validateEmailText("");
    expect(r).toEqual({ ok: false, reason: "Email content cannot be empty." });
  });

  it("rejects whitespace-only", () => {
    const r = validateEmailText("   \n\t  ");
    expect(r.ok).toBe(false);
  });

  it("rejects too-short text", () => {
    const r = validateEmailText("hi");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toContain(String(MIN_EMAIL_LENGTH));
  });

  it("rejects too-long text", () => {
    const r = validateEmailText("a".repeat(MAX_EMAIL_LENGTH + 1));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toContain(String(MAX_EMAIL_LENGTH.toLocaleString()));
  });

  it("rejects non-string input", () => {
    // Simulate a caller bug — type system blocks this at compile time but
    // we belt-and-brace at runtime.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = validateEmailText(null as any);
    expect(r.ok).toBe(false);
  });
});

describe("getLengthMeter", () => {
  it("reports ok severity well under limit", () => {
    const m = getLengthMeter("hello world");
    expect(m.severity).toBe("ok");
    expect(m.current).toBe(11);
    expect(m.max).toBe(MAX_EMAIL_LENGTH);
  });

  it("reports warn severity within 10% of limit", () => {
    const m = getLengthMeter("x".repeat(Math.floor(MAX_EMAIL_LENGTH * 0.95)));
    expect(m.severity).toBe("warn");
  });

  it("reports error severity at the limit", () => {
    const m = getLengthMeter("x".repeat(MAX_EMAIL_LENGTH));
    expect(m.severity).toBe("error");
  });
});
