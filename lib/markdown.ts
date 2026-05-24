/**
 * Safe markdown → HTML rendering for LLM-generated content.
 *
 * Gemini returns markdown (per our prompts). Rendering it directly with
 * `dangerouslySetInnerHTML` opens an XSS vector — an attacker who can
 * influence the email text could potentially get markdown-syntax-injected
 * HTML executed. We defang that by:
 *   1. Parsing with `marked` (battle-tested, well-maintained).
 *   2. Sanitising the resulting HTML with `DOMPurify` using a strict
 *      allowlist of inline + flow elements. Scripts, iframes, event
 *      handlers, javascript: URLs, etc. are all stripped.
 */

import DOMPurify from "dompurify";
import { marked } from "marked";

// Configure marked for sync output and GFM (tables, strikethrough, etc.).
marked.setOptions({
  gfm: true,
  breaks: true,
  async: false,
});

const ALLOWED_TAGS = [
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "del",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "li",
  "ol",
  "p",
  "pre",
  "span",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul",
];

const ALLOWED_ATTRS = ["href", "title", "target", "rel", "class"];

/**
 * Convert untrusted markdown to safe HTML.
 *
 * Always returns sanitized output. Empty input → empty string.
 * `<a>` links are forced to `target="_blank"` + `rel="noopener noreferrer"`
 * because rendered content is from an LLM analyzing untrusted email content.
 */
export function renderMarkdownSafe(markdown: string): string {
  if (!markdown) return "";

  const rawHtml = marked.parse(markdown) as string;

  const clean = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTRS,
    // Disallow data: URLs entirely; only http/https/mailto are safe destinations.
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });

  // Force safe link behavior — applied AFTER sanitize so DOMPurify can't strip these attrs.
  return clean.replace(
    /<a\s+([^>]*?)href="([^"]+)"([^>]*)>/gi,
    (_match, before, href, after) =>
      `<a ${before}href="${href}"${after} target="_blank" rel="noopener noreferrer">`,
  );
}
