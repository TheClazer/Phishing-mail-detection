import { describe, expect, it } from "vitest";

import {
  AnalysisError,
  classifyError,
  MissingApiKeyError,
  NetworkError,
  RateLimitError,
} from "../lib/errors";

describe("classifyError", () => {
  it("passes through AnalysisError unchanged", () => {
    const original = new AnalysisError("test");
    expect(classifyError(original)).toBe(original);
  });

  it("classifies 'API key' messages as MissingApiKeyError", () => {
    const err = classifyError(new Error("Invalid API key provided"));
    expect(err).toBeInstanceOf(MissingApiKeyError);
    expect(err.hint).toBeDefined();
  });

  it("classifies 'rate limit' messages as RateLimitError", () => {
    const err = classifyError(new Error("rate limit exceeded"));
    expect(err).toBeInstanceOf(RateLimitError);
  });

  it("classifies 429 status mentions as RateLimitError", () => {
    const err = classifyError(new Error("Request failed with status 429"));
    expect(err).toBeInstanceOf(RateLimitError);
  });

  it("classifies 'quota' messages as RateLimitError", () => {
    const err = classifyError(new Error("Quota exceeded for project"));
    expect(err).toBeInstanceOf(RateLimitError);
  });

  it("classifies network errors as NetworkError", () => {
    const err = classifyError(new Error("fetch failed: ECONNREFUSED"));
    expect(err).toBeInstanceOf(NetworkError);
  });

  it("falls back to generic AnalysisError", () => {
    const err = classifyError(new Error("some weird thing happened"));
    expect(err).toBeInstanceOf(AnalysisError);
    expect(err).not.toBeInstanceOf(RateLimitError);
    expect(err).not.toBeInstanceOf(NetworkError);
    expect(err).not.toBeInstanceOf(MissingApiKeyError);
    expect(err.message).toContain("some weird thing happened");
  });

  it("handles non-Error throwables (strings, numbers)", () => {
    expect(classifyError("just a string")).toBeInstanceOf(AnalysisError);
    expect(classifyError(42)).toBeInstanceOf(AnalysisError);
  });
});

describe("MissingApiKeyError", () => {
  it("has a default hint pointing at .env.local", () => {
    const err = new MissingApiKeyError();
    expect(err.hint).toContain(".env");
  });
});
