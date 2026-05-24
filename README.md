<div align="center">

# Gemini Phishing Detector

**A three-tier AI phishing classifier that explains itself.**

Paste an email, get an instant verdict, then drill down into a senior-analyst-grade breakdown — or have Gemini cross-check claimed senders and links against live Google Search results.

[![CI](https://github.com/TheClazer/Phishing-mail-detection/actions/workflows/ci.yml/badge.svg)](https://github.com/TheClazer/Phishing-mail-detection/actions/workflows/ci.yml)
[![Node 20+](https://img.shields.io/badge/node-20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React 19](https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Pro%20%2B%20Flash-c084fc?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/license-MIT-d4bbff?style=flat-square)](LICENSE)

</div>

---

## What it does

Three escalating analysis modes, all powered by Gemini, all returning structured output:

| Tier | Model | Purpose | Speed |
|---|---|---|---|
| **1. Quick scan** | `gemini-2.5-flash` | One-word verdict: `phishing` / `safe` / `unclear` | ~1s |
| **2. In-depth analysis** | `gemini-2.5-pro` w/ 32k thinking budget | Full markdown report with verdict, indicators, sender analysis, URL/attachment risk, recommended action | ~10–20s |
| **3. Grounded search** | `gemini-2.5-flash` + Google Search tool | Cross-checks claimed senders, domains, and companies against live web results, with cited sources | ~5–10s |

You can run any tier independently — start with the quick scan, escalate only if the verdict's unclear or you need the explanation.

## Why this exists

LLM-only phishing classifiers are a dime a dozen and most are black boxes — "is this phish? y/n" with no reasoning. This one is built around two ideas:

1. **Explanations are the product.** A verdict you can't defend isn't useful. Tier 2 quotes the exact phrases that triggered the verdict so users learn what to look for.
2. **The web is the ground truth.** Tier 3 uses Gemini's Google Search grounding so claims like "from amazon.in" get verified against the real WHOIS and SEO footprint, not the model's training data.

## Features

- **Three-tier escalation** — start fast, deepen only when needed
- **5 curated sample emails** — try it instantly without finding a real phish in your inbox
- **Cited sources** for grounded-search results (clickable, opened in new tab with `rel=noopener`)
- **XSS-hardened markdown rendering** — LLM output is parsed by `marked` then sanitized by `DOMPurify` with a strict allowlist
- **Typed error handling** — distinguishes missing API key, rate limit, network outage, and generic failures with targeted hints
- **Input validation** with a character-count meter (min 10, max 50,000 chars)
- **Top-level error boundary** — no white-page-of-doom on render crashes
- **Dark mode** via Tailwind's `dark:` variants (follows system preference)
- **Fully typed** TypeScript + ESLint + Vitest in CI

## Quick start

Requires **Node 20+** and a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

```bash
git clone https://github.com/TheClazer/Phishing-mail-detection.git
cd Phishing-mail-detection
npm install

# Configure your API key
cp .env.example .env.local
# Open .env.local and replace `your-gemini-api-key-here` with your real key

npm run dev
# Opens at http://localhost:3000
```

## Project structure

```
.
├── App.tsx                     # top-level component, orchestrates state
├── index.tsx                   # React DOM mount
├── index.html                  # Vite entry + Tailwind CDN + import-map
├── components/
│   ├── EmailInput.tsx          # textarea with char-meter and clear button
│   ├── ErrorBoundary.tsx       # top-level crash recovery
│   ├── Header.tsx
│   ├── ResultDisplay.tsx       # verdict banner + drill-down buttons + safe markdown render
│   ├── SampleEmails.tsx        # collapsible gallery of sample inputs
│   └── icons.tsx               # inline SVG icons
├── services/
│   └── geminiService.ts        # all 3 Gemini calls, typed-error throwing
├── lib/
│   ├── errors.ts               # AnalysisError + classifyError pattern matcher
│   ├── markdown.ts             # XSS-safe markdown → HTML (marked + DOMPurify)
│   ├── sampleEmails.ts         # curated example emails
│   └── validation.ts           # pure input validators + char-meter helper
├── tests/                      # vitest suites for lib/* and services/*
├── vitest.config.ts
├── eslint.config.js            # flat-config ESLint 9
├── vite.config.ts
└── .github/workflows/ci.yml    # typecheck + lint + test + build matrix
```

## npm scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR on port 3000 |
| `npm run build` | Typecheck then production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run vitest once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with v8 coverage report |
| `npm run lint` | ESLint with zero-warnings enforcement |
| `npm run typecheck` | `tsc --noEmit` |

## Security notes

- **Never commit `.env.local`.** It's git-ignored. If you accidentally push your key, rotate it at [AI Studio](https://aistudio.google.com/apikey).
- **LLM output is sanitized.** Gemini can be tricked into emitting unsafe HTML if the email body contains injection attempts. We render all LLM output through `marked` + `DOMPurify` with a strict tag/attribute allowlist (see `lib/markdown.ts`).
- **External links are forced to safe defaults** (`target="_blank"` + `rel="noopener noreferrer"`).
- **No telemetry, no analytics.** This runs entirely in your browser. Your email content goes only to Google Gemini.

## Roadmap

- Side-by-side diff view comparing claimed sender with cited search results
- Local history of analyzed emails (localStorage, no backend)
- Browser extension build that scans Gmail/Outlook inline
- Bulk analysis mode (CSV in → verdicts CSV out)

## License

MIT — see [LICENSE](LICENSE).

---

<sub>Built by [Rayyan Ahmed Shaikh](https://github.com/TheClazer) at R.V. College of Engineering, Bangalore. PRs welcome.</sub>
