# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Type-check + production build
npm run lint     # ESLint via Next.js
```

No test framework is configured. Validate changes via `npm run build` (catches TypeScript errors) and manual testing in the browser.

Deploy is automatic: every push to `main` on GitHub triggers a Vercel deploy to `www.cademeupacote.com.br`.

## Architecture

Two user-facing routes:
- `/` — Landing page (`app/page.tsx`). Static, no interactivity.
- `/app` — The wizard (`app/app/page.tsx`). All form state is client-side only (no server actions, no DB). Draft persists to `localStorage` under key `cmp.app.v1`.

One API route:
- `POST /api/gerar` (`app/api/gerar/route.ts`) — receives a `FormState`, builds a Portuguese prompt, calls `claude-sonnet-4-5` via `@anthropic-ai/sdk`, and returns `{ whatsapp, reclameaqui, consumidor }` as JSON. Requires `ANTHROPIC_API_KEY` env var.

Shared types and data live in `lib/constants.ts`: `PROBLEMS`, `STORES`, `CHANNELS`, `FormState`, `initialFormState`. This is the single source of truth for what problems and stores the app supports.

## Styling

CSS-only — no Tailwind, no component library. All design tokens (colors, fonts, shadows) are CSS variables defined at the top of `app/globals.css`. Primary color is `--primary: #F97316` (orange). Display font is Fraunces (loaded from Google Fonts in `layout.tsx`); body font is Inter Tight.

## Key constraints

- **No database in phase 1.** Email capture in the result screen is a placeholder — the "Quero o lembrete" button shows a toast but doesn't persist anything.
- **WhatsApp button opens `wa.me/?text=...` without a phone number.** Each store's SAC WhatsApp number is not yet in the codebase.
- **`ANTHROPIC_API_KEY` must be set** — locally in `.env.local`, on Vercel via the dashboard. The API route checks for this and returns 500 if missing.
- The prompt instructs Claude to return strict JSON with no markdown wrapping. The route strips any accidental ` ```json ` blocks before parsing.
