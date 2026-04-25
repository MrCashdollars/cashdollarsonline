# CDO AI Chatbot Backend — Design Spec
**Date:** 2026-04-25
**Status:** Approved

---

## Overview

Wire the existing CDO AI chatbot UI (`src/components/ui/ai-assistant-interface.tsx`) to a real Anthropic API backend. The assistant answers questions based on CashDollarsOnline blog posts and YouTube video content, streams responses word-by-word, and limits free usage to 5 messages per session before presenting a newsletter signup CTA.

---

## Architecture

Three new files, one updated file:

```
src/pages/api/chat.ts          ← Astro POST endpoint (streaming)
src/lib/anthropic.ts           ← Anthropic SDK client wrapper
src/components/ui/
  ai-assistant-interface.tsx   ← Updated: streaming fetch, session cap, CTA
.env.local / .env.example      ← ANTHROPIC_API_KEY added
```

**New dependency:** `@anthropic-ai/sdk` (official Anthropic Node SDK)

---

## Data Flow

1. User submits a message → frontend checks `sessionStorage` for `cdo_msg_count`
2. If count < 5: `POST /api/chat` with body `{ message: string, history: Message[] }`
3. API endpoint validates the request, calls Anthropic with streaming enabled using model `claude-haiku-4-5-20251001`
4. Server streams response chunks back as newline-delimited JSON: `data: {"token":"..."}`; final chunk: `data: [DONE]`
5. Frontend reads the stream via `ReadableStream`, appending each token to the assistant bubble in real-time
6. When `[DONE]` is received: increment `sessionStorage` `cdo_msg_count`
7. If count reaches 5: replace input area with newsletter signup CTA

---

## Session Rate Limit (Client-Side, Option A)

- Storage key: `cdo_msg_count` in `sessionStorage` (resets when tab closes)
- Gate: checked before every send; if `>= 5`, send button is hidden and CTA is shown
- CTA copy: *"You've used your 5 free questions. Join our newsletter for unlimited access to CDO AI and members-only content."*
- CTA button: opens the existing `LeadMagnetDialog` component
- No server-side rate limiting in v1 (add Upstash Redis in v2 if traffic warrants it)

---

## System Prompt

```
You are the Cash Dollars Online AI assistant. You answer questions based 
on the content published on CashDollarsOnline — its blog posts and 
YouTube videos.

SCOPE — only answer questions about CashDollarsOnline content covering:
- Affiliate marketing
- Digital products (ebooks, templates, courses)
- Content monetization (YouTube, blogging)
- Email marketing for side hustles
- Income strategies and side-hustle roadmaps

RULES:
- Keep answers concise: 3–5 sentences maximum
- Never make income guarantees or use words like "easy", "passive", 
  "secret", or "guaranteed"
- Acknowledge difficulty and realistic timelines
- No financial advice — educational purposes only
- If asked anything off-topic, reply: "I'm focused on CashDollarsOnline 
  content and can't help with [topic], but I'm happy to answer questions 
  about CashDollarsOnline and its content related to: affiliate marketing, 
  digital products, or building a side hustle."
```

---

## API Endpoint — `src/pages/api/chat.ts`

- **Method:** POST only (405 for all others)
- **Request body:** `{ message: string, history: Array<{ role: "user"|"assistant", content: string }> }`
- **Response:** `Content-Type: text/event-stream`, newline-delimited JSON chunks
- **Chunk format:** `data: {"token":"<text>"}\n\n`
- **End signal:** `data: [DONE]\n\n`
- **Model:** `claude-haiku-4-5-20251001`
- **Max tokens:** 300 (enforces concise replies server-side)
- **API key:** read from `process.env.ANTHROPIC_API_KEY` — never exposed to client

---

## Anthropic Client — `src/lib/anthropic.ts`

Thin wrapper that:
- Initialises `Anthropic` with `apiKey` from env
- Exports a `streamChatResponse(systemPrompt, history, userMessage)` function that returns an Anthropic streaming response object

---

## Frontend Updates — `ai-assistant-interface.tsx`

Changes from current placeholder implementation:

| Current | New |
|---|---|
| `await new Promise((r) => setTimeout(r, 1200))` | `fetch('/api/chat', { method: 'POST', body: JSON.stringify({...}) })` |
| Static placeholder response string | Token-by-token stream appended to assistant message |
| No session tracking | `sessionStorage` count incremented after each completed response |
| No rate limit UI | Newsletter CTA replaces input after 5 messages |

The existing typing-dots animation is removed once streaming begins (first token arrives replaces it).

---

## Error Handling

| Scenario | User-facing behaviour |
|---|---|
| `ANTHROPIC_API_KEY` missing | Assistant bubble: "The AI assistant is temporarily unavailable — please try again shortly." |
| Anthropic API error (5xx, timeout) | Same generic message; send button re-enabled for retry |
| Network failure on client | Same generic message; send button re-enabled |
| Empty input | Already handled — send button disabled in existing UI |

No stack traces, API keys, or internal error details are ever sent to the browser.

---

## Environment Variables

```env
# .env.local (never commit)
ANTHROPIC_API_KEY=sk-ant-...

# .env.example (commit this)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

---

## Out of Scope (v1)

- Server-side persistent rate limiting (Upstash Redis) — defer to v2
- Conversation memory across sessions
- RAG / vector search over actual blog/video content
- Admin dashboard for conversation logs
