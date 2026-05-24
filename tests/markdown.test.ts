/**
 * @vitest-environment jsdom
 *
 * DOMPurify needs a DOM, so this suite runs under jsdom.
 */

import { describe, expect, it } from "vitest";

import { renderMarkdownSafe } from "../lib/markdown";

describe("renderMarkdownSafe", () => {
  it("returns empty string for empty input", () => {
    expect(renderMarkdownSafe("")).toBe("");
  });

  it("renders basic markdown", () => {
    const html = renderMarkdownSafe("**bold** and *italic*");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<em>italic</em>");
  });

  it("renders headings", () => {
    const html = renderMarkdownSafe("### Verdict");
    expect(html).toContain("<h3>Verdict</h3>");
  });

  it("renders lists", () => {
    const html = renderMarkdownSafe("- one\n- two\n- three");
    expect(html).toMatch(/<ul>[\s\S]*<li>one<\/li>[\s\S]*<li>two<\/li>[\s\S]*<li>three<\/li>[\s\S]*<\/ul>/);
  });

  it("strips <script> tags", () => {
    const malicious = 'Hello <script>alert("xss")</script> world';
    const html = renderMarkdownSafe(malicious);
    expect(html).not.toContain("<script");
    expect(html).not.toContain("alert");
  });

  it("strips javascript: links", () => {
    const malicious = '[click](javascript:alert(1))';
    const html = renderMarkdownSafe(malicious);
    expect(html).not.toContain("javascript:");
  });

  it("strips onerror handlers", () => {
    const malicious = '<img src=x onerror="alert(1)">';
    const html = renderMarkdownSafe(malicious);
    expect(html).not.toContain("onerror");
  });

  it("forces target=_blank rel=noopener on links", () => {
    const html = renderMarkdownSafe("[example](https://example.com)");
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("preserves safe https links", () => {
    const html = renderMarkdownSafe("[github](https://github.com)");
    expect(html).toContain('href="https://github.com"');
  });

  it("strips iframes", () => {
    const malicious = '<iframe src="evil.com"></iframe>';
    const html = renderMarkdownSafe(malicious);
    expect(html).not.toContain("<iframe");
  });
});
