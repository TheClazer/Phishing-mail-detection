import { describe, expect, it } from "vitest";

import { SAMPLE_EMAILS } from "../lib/sampleEmails";

describe("SAMPLE_EMAILS", () => {
  it("has at least 4 samples", () => {
    expect(SAMPLE_EMAILS.length).toBeGreaterThanOrEqual(4);
  });

  it("has a mix of phishing and safe examples", () => {
    const phish = SAMPLE_EMAILS.filter((s) => s.isPhishing);
    const safe = SAMPLE_EMAILS.filter((s) => !s.isPhishing);
    expect(phish.length).toBeGreaterThan(0);
    expect(safe.length).toBeGreaterThan(0);
  });

  it("all samples have unique ids", () => {
    const ids = SAMPLE_EMAILS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all samples have non-trivial bodies", () => {
    for (const sample of SAMPLE_EMAILS) {
      expect(sample.body.length).toBeGreaterThan(50);
      expect(sample.label).toBeTruthy();
      expect(sample.description).toBeTruthy();
    }
  });
});
