/**
 * Gemini API wrapper for phishing detection.
 *
 * Three analysis tiers:
 *   1. analyzeEmailText        — fast yes/no classification (gemini-2.5-flash)
 *   2. getDetailedAnalysis     — point-by-point breakdown (gemini-2.5-pro with thinking)
 *   3. checkWithGoogleSearch   — grounded fact-check via Google Search tool
 *
 * All three throw typed AnalysisErrors (see lib/errors.ts) so the UI can
 * render targeted messages for API-key, rate-limit, and network failures.
 */

import { GoogleGenAI } from "@google/genai";

import { classifyError, MissingApiKeyError } from "../lib/errors";

// Cache the client across calls — instantiating GoogleGenAI per request adds latency.
let _client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (_client) return _client;
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new MissingApiKeyError();
  _client = new GoogleGenAI({ apiKey });
  return _client;
}

// Reset between tests; never call this in app code.
export function __resetClientForTesting(): void {
  _client = null;
}

/* ─── classification (fast) ──────────────────────────────────────────────── */

export type ClassificationVerdict = "phishing" | "safe" | "unclear";

const CLASSIFICATION_PROMPT = `You are a phishing classifier. Read the email below and respond with EXACTLY ONE WORD: "phishing", "safe", or "unclear". No explanation, no punctuation, no other text.

Use "unclear" only if the email is too short, garbled, or context-free to judge confidently.

Email:
"""
`;

export async function analyzeEmailText(emailText: string): Promise<ClassificationVerdict> {
  try {
    const response = await getClient().models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${CLASSIFICATION_PROMPT}${emailText}\n"""`,
    });
    const verdict = (response.text ?? "").trim().toLowerCase();
    if (verdict.includes("phishing")) return "phishing";
    if (verdict.includes("safe")) return "safe";
    return "unclear";
  } catch (err) {
    throw classifyError(err);
  }
}

/* ─── detailed analysis (slow + thinking) ────────────────────────────────── */

const DETAILED_PROMPT = `You are a senior cybersecurity analyst specializing in email-borne threats (phishing, BEC, credential harvesting, malicious attachments).

Analyze the following email and produce a structured markdown report with these sections, in order:

### Verdict
A single line: "Phishing", "Likely phishing", "Suspicious but inconclusive", "Likely safe", or "Safe".

### Indicators
A bulleted list of every red flag you spotted. For each: quote the exact phrase or element from the email, then explain in one sentence why it's a red flag.

### Sender analysis
- Display name vs. actual address discrepancies
- Domain age / legitimacy concerns
- Any spoofing patterns (homoglyphs, subdomain tricks)

### URLs and attachments
For every link or attachment mentioned, assess its risk. Flag URL shorteners, lookalike domains, and mismatched href/text.

### Recommended action
What the recipient should do (delete, report, verify by separate channel, etc.).

Rules:
- Markdown only, no HTML.
- Be specific. Don't say "the email uses urgency" — quote the exact urgent phrase.
- If the email is genuinely safe, say so and explain what makes it credible.

Email:
"""
`;

export async function getDetailedAnalysis(emailText: string): Promise<string> {
  try {
    const response = await getClient().models.generateContent({
      model: "gemini-2.5-pro",
      contents: `${DETAILED_PROMPT}${emailText}\n"""`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    return response.text ?? "";
  } catch (err) {
    throw classifyError(err);
  }
}

/* ─── grounded search ────────────────────────────────────────────────────── */

const SEARCH_PROMPT = `Use Google Search to verify the legitimacy of any senders, domains, companies, or claims in the following email.

For each verifiable element:
1. State what you searched for.
2. Summarize what the search results show.
3. Conclude whether it supports or contradicts the email's claims.

End with a single-sentence verdict on the email's legitimacy based on search evidence.

Email:
"""
`;

export type GroundingSource = {
  uri: string;
  title?: string;
};

export type SearchAnalysisResult = {
  text: string;
  sources: GroundingSource[];
};

export async function checkWithGoogleSearch(emailText: string): Promise<SearchAnalysisResult> {
  try {
    const response = await getClient().models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${SEARCH_PROMPT}${emailText}\n"""`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources: GroundingSource[] = chunks
      .map((c) => c.web)
      .filter((w): w is { uri: string; title?: string } => Boolean(w?.uri))
      .map((w) => ({ uri: w.uri, title: w.title }));

    return { text: response.text ?? "", sources };
  } catch (err) {
    throw classifyError(err);
  }
}
