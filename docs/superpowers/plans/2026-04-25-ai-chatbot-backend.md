# CDO AI Chatbot Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the CDO AI chatbot UI to the Anthropic API with real-time streaming, a 5-message session cap, and a newsletter signup CTA when the cap is reached.

**Architecture:** An Astro hybrid-mode API endpoint (`POST /api/chat`) accepts the user's message and conversation history, calls `claude-haiku-4-5-20251001` via the Anthropic SDK with a CDO-scoped system prompt, and streams tokens back as SSE. The React component reads the stream token-by-token, appends each to the assistant bubble in real time, and tracks a `sessionStorage` counter that replaces the input with a `LeadMagnetDialog` CTA after 5 messages.

**Tech Stack:** Astro 4 hybrid output, `@astrojs/node` adapter (local dev), `@anthropic-ai/sdk`, React 19, vitest for unit tests.

**Spec:** `docs/superpowers/specs/2026-04-25-ai-chatbot-backend-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `astro.config.mjs` | Modify | Switch to `output: 'hybrid'`, add `@astrojs/node` adapter |
| `.env.example` | Modify | Document `ANTHROPIC_API_KEY` |
| `.env.local` | Create (manual) | User adds their real API key here |
| `vitest.config.ts` | Create | Vitest config with `@` alias |
| `src/lib/anthropic.ts` | Create | System prompt, `ChatMessage` type, `streamChatResponse()` |
| `src/pages/api/chat.ts` | Create | POST endpoint — validates request, streams Anthropic response |
| `src/components/ui/ai-assistant-interface.tsx` | Modify | Streaming fetch, session cap, newsletter CTA |
| `tests/lib/anthropic.test.ts` | Create | Unit tests for `streamChatResponse` |

---

## Task 1: Install Dependencies and Configure Environment

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json` (via npm install)
- Modify: `.env.example`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install runtime and dev dependencies**

```bash
npm install @anthropic-ai/sdk @astrojs/node
npm install -D vitest
```

Expected output: packages added, no peer-dep errors.

- [ ] **Step 2: Add test scripts to package.json**

Open `package.json` and add two lines inside `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

The scripts block should now read:

```json
"scripts": {
  "dev": "astro dev",
  "start": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "typecheck": "astro check && tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Create vitest.config.ts**

Create `vitest.config.ts` at the project root:

```typescript
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

- [ ] **Step 4: Switch Astro to hybrid output with Node adapter**

Replace the entire contents of `astro.config.mjs` with:

```js
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import node from '@astrojs/node'
import { fileURLToPath } from 'url'

export default defineConfig({
  site: 'https://cashdollarsonline.com',
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap(),
  ],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
})
```

> **Note for Vercel deployment:** swap `@astrojs/node` for `@astrojs/vercel` and change `adapter: vercel()`. The rest of the config stays the same.

- [ ] **Step 5: Document the API key in .env.example**

Open `.env.example` and add:

```env
# Anthropic API key — get yours at https://console.anthropic.com
# Never commit your real key. Add the real value to .env.local (gitignored).
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

- [ ] **Step 6: Create .env.local with your real API key**

Create `.env.local` at the project root (this file is gitignored):

```env
ANTHROPIC_API_KEY=sk-ant-YOUR_REAL_KEY_HERE
```

Replace `sk-ant-YOUR_REAL_KEY_HERE` with your actual key from [console.anthropic.com](https://console.anthropic.com).

- [ ] **Step 7: Verify Astro still builds**

```bash
npm run build
```

Expected: build completes without errors. The output changes from static HTML to Node server files.

- [ ] **Step 8: Commit**

```bash
git add astro.config.mjs package.json package-lock.json vitest.config.ts .env.example
git commit -m "feat: add Anthropic SDK, hybrid output, vitest"
```

---

## Task 2: Create Anthropic Client Wrapper (TDD)

**Files:**
- Create: `src/lib/anthropic.ts`
- Create: `tests/lib/anthropic.test.ts`

- [ ] **Step 1: Create the tests directory**

```bash
mkdir -p tests/lib
```

- [ ] **Step 2: Write the failing tests**

Create `tests/lib/anthropic.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Anthropic from '@anthropic-ai/sdk'
import { streamChatResponse, SYSTEM_PROMPT } from '../../src/lib/anthropic'

vi.mock('@anthropic-ai/sdk')

const mockStreamReturn = Symbol('stream')
const mockStreamFn = vi.fn()

beforeEach(() => {
  mockStreamFn.mockReset()
  mockStreamFn.mockReturnValue(mockStreamReturn)
  vi.mocked(Anthropic).mockImplementation(
    () => ({ messages: { stream: mockStreamFn } } as unknown as Anthropic)
  )
})

describe('streamChatResponse', () => {
  it('throws when apiKey is empty string', () => {
    expect(() => streamChatResponse('', [], 'hello')).toThrow(
      'ANTHROPIC_API_KEY is not configured'
    )
  })

  it('calls messages.stream with correct model and max_tokens', () => {
    streamChatResponse('sk-test', [], 'What is affiliate marketing?')
    expect(mockStreamFn).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
      })
    )
  })

  it('appends userMessage to history in messages array', () => {
    const history: Array<{ role: 'user' | 'assistant'; content: string }> = [
      { role: 'user', content: 'Hi' },
      { role: 'assistant', content: 'Hello' },
    ]
    streamChatResponse('sk-test', history, 'Tell me about affiliate marketing')
    expect(mockStreamFn).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: [
          ...history,
          { role: 'user', content: 'Tell me about affiliate marketing' },
        ],
      })
    )
  })

  it('sends the CDO system prompt', () => {
    streamChatResponse('sk-test', [], 'hi')
    expect(mockStreamFn).toHaveBeenCalledWith(
      expect.objectContaining({ system: SYSTEM_PROMPT })
    )
  })

  it('returns the stream object from client.messages.stream', () => {
    const result = streamChatResponse('sk-test', [], 'hi')
    expect(result).toBe(mockStreamReturn)
  })
})
```

- [ ] **Step 3: Run tests — verify they all FAIL**

```bash
npm test
```

Expected: 5 tests fail with `Cannot find module '../../src/lib/anthropic'`.

- [ ] **Step 4: Create src/lib/anthropic.ts**

Create `src/lib/anthropic.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk'

export const SYSTEM_PROMPT = `You are the Cash Dollars Online AI assistant. You answer questions based on the content published on CashDollarsOnline — its blog posts and YouTube videos.

SCOPE — only answer questions about CashDollarsOnline content covering:
- Affiliate marketing
- Digital products (ebooks, templates, courses)
- Content monetization (YouTube, blogging)
- Email marketing for side hustles
- Income strategies and side-hustle roadmaps

RULES:
- Keep answers concise: 3–5 sentences maximum
- Never make income guarantees or use words like "easy", "passive", "secret", or "guaranteed"
- Acknowledge difficulty and realistic timelines
- No financial advice — educational purposes only
- If asked anything off-topic, reply: "I'm focused on CashDollarsOnline content and can't help with [topic], but I'm happy to answer questions about CashDollarsOnline and its content related to: affiliate marketing, digital products, or building a side hustle."`

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export function streamChatResponse(
  apiKey: string,
  history: ChatMessage[],
  userMessage: string
) {
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured')
  const client = new Anthropic({ apiKey })
  return client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [...history, { role: 'user', content: userMessage }],
  })
}
```

- [ ] **Step 5: Run tests — verify they all PASS**

```bash
npm test
```

Expected output:
```
✓ tests/lib/anthropic.test.ts (5)
  ✓ streamChatResponse > throws when apiKey is empty string
  ✓ streamChatResponse > calls messages.stream with correct model and max_tokens
  ✓ streamChatResponse > appends userMessage to history in messages array
  ✓ streamChatResponse > sends the CDO system prompt
  ✓ streamChatResponse > returns the stream object from client.messages.stream

Test Files  1 passed (1)
Tests       5 passed (5)
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/anthropic.ts tests/lib/anthropic.test.ts
git commit -m "feat: add Anthropic streaming lib with CDO system prompt"
```

---

## Task 3: Create the API Endpoint

**Files:**
- Create: `src/pages/api/chat.ts`

- [ ] **Step 1: Create src/pages/api/chat.ts**

```typescript
import type { APIRoute } from 'astro'
import { streamChatResponse, type ChatMessage } from '../../lib/anthropic'

export const prerender = false

export const GET: APIRoute = () => new Response(null, { status: 405 })

export const POST: APIRoute = async ({ request }) => {
  let body: { message?: unknown; history?: unknown }
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const { message, history } = body

  if (typeof message !== 'string' || !message.trim()) {
    return new Response(JSON.stringify({ error: 'message is required' }), { status: 400 })
  }

  if (!Array.isArray(history)) {
    return new Response(JSON.stringify({ error: 'history must be an array' }), { status: 400 })
  }

  const apiKey = (import.meta.env.ANTHROPIC_API_KEY as string | undefined) ?? ''
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = streamChatResponse(
          apiKey,
          history as ChatMessage[],
          message
        )
        for await (const event of anthropicStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ token: event.delta.text })}\n\n`)
            )
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: 'AI unavailable' })}\n\n`)
        )
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
```

- [ ] **Step 2: Start the dev server**

```bash
npm run dev
```

Expected: server starts on `http://localhost:4321` with no errors.

- [ ] **Step 3: Manually test the endpoint with curl**

Open a second terminal and run:

```bash
curl -X POST http://localhost:4321/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is affiliate marketing?","history":[]}' \
  --no-buffer
```

Expected: a stream of SSE lines like:
```
data: {"token":"Affiliate"}
data: {"token":" marketing"}
data: {"token":" is"}
...
data: [DONE]
```

- [ ] **Step 4: Test validation — missing message**

```bash
curl -X POST http://localhost:4321/api/chat \
  -H "Content-Type: application/json" \
  -d '{"history":[]}'
```

Expected: `{"error":"message is required"}` with HTTP 400.

- [ ] **Step 5: Test GET returns 405**

```bash
curl -X GET http://localhost:4321/api/chat -i
```

Expected: HTTP 405 response.

- [ ] **Step 6: Commit**

```bash
git add src/pages/api/chat.ts
git commit -m "feat: add streaming chat API endpoint"
```

---

## Task 4: Update the React Component

**Files:**
- Modify: `src/components/ui/ai-assistant-interface.tsx`

This task rewrites `handleSendMessage` and adds the 5-message session cap with newsletter CTA. The full updated component is shown below — replace the entire file contents.

- [ ] **Step 1: Replace ai-assistant-interface.tsx with the streaming version**

Replace the complete contents of `src/components/ui/ai-assistant-interface.tsx`:

```tsx
'use client'

import type React from 'react'
import { useState, useRef } from 'react'
import {
  Search,
  ArrowUp,
  Plus,
  FileText,
  TrendingUp,
  ShoppingBag,
  Video,
  DollarSign,
  Sparkles,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LeadMagnetDialog } from './dialog'

/* ── CDO-specific command suggestions ──────────────────────────────── */
const commandSuggestions = {
  income: [
    'How long does it take to make my first $100 online?',
    'What is the easiest way to start with under $100?',
    'Is affiliate marketing still worth it in 2025?',
    'What are the real costs of starting a digital products business?',
    'How many hours per week does this actually take?',
  ],
  affiliate: [
    'Which affiliate networks pay the highest commissions?',
    'How do I pick products to promote without losing credibility?',
    'Do I need a website to do affiliate marketing?',
    'What is a realistic first-month income from affiliate marketing?',
    'How do I disclose affiliate links properly?',
  ],
  digital: [
    'What kind of digital product should I create first?',
    'How do I price an ebook or template?',
    'What platforms can I sell digital downloads on?',
    'How long does it take to create and launch a digital product?',
    'Do I need design skills to make a digital product?',
  ],
}

type CategoryKey = keyof typeof commandSuggestions

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SESSION_KEY = 'cdo_msg_count'
const MSG_LIMIT = 5
const ERROR_MSG =
  'The AI assistant is temporarily unavailable — please try again shortly.'

function getSessionCount(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(sessionStorage.getItem(SESSION_KEY) ?? '0', 10)
}

function incrementSessionCount(): number {
  const next = getSessionCount() + 1
  sessionStorage.setItem(SESSION_KEY, String(next))
  return next
}

export function AIAssistantInterface() {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [showUploadAnimation, setShowUploadAnimation] = useState(false)
  const [activeCommandCategory, setActiveCommandCategory] = useState<CategoryKey | null>(null)
  const [showRateLimitCTA, setShowRateLimitCTA] = useState(() => getSessionCount() >= MSG_LIMIT)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUploadFile = () => {
    setShowUploadAnimation(true)
    setTimeout(() => {
      setUploadedFiles((prev) => [...prev, 'Document.pdf'])
      setShowUploadAnimation(false)
    }, 1500)
  }

  const handleCommandSelect = (command: string) => {
    setInputValue(command)
    setActiveCommandCategory(null)
    inputRef.current?.focus()
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || showRateLimitCTA) return

    if (getSessionCount() >= MSG_LIMIT) {
      setShowRateLimitCTA(true)
      return
    }

    const userMessage = inputValue.trim()
    const currentHistory = messages
    setInputValue('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: currentHistory }),
      })

      if (!response.ok || !response.body) throw new Error('Request failed')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantAdded = false
      let finished = false

      while (!finished) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        const lines = text.split('\n\n').filter(Boolean)

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)

          if (data === '[DONE]') {
            const newCount = incrementSessionCount()
            if (newCount >= MSG_LIMIT) setShowRateLimitCTA(true)
            finished = true
            break
          }

          try {
            const parsed = JSON.parse(data) as { token?: string; error?: string }

            if (parsed.error) {
              setIsTyping(false)
              setMessages((prev) => [...prev, { role: 'assistant', content: ERROR_MSG }])
              finished = true
              break
            }

            if (parsed.token) {
              if (!assistantAdded) {
                setIsTyping(false)
                setMessages((prev) => [...prev, { role: 'assistant', content: parsed.token! }])
                assistantAdded = true
              } else {
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: updated[updated.length - 1].content + parsed.token,
                  }
                  return updated
                })
              }
            }
          } catch {
            // ignore malformed chunk
          }
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: ERROR_MSG }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="w-full bg-white py-16 px-4">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">

        {/* CDO coin icon */}
        <div className="mb-6 w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#2E7D32' }}>
          <DollarSign className="w-8 h-8 text-white" />
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Ask Me Anything
            </h2>
            <p className="text-gray-500 max-w-md text-sm sm:text-base">
              Questions about making money online? Ask below. I'm trained on the Cash Dollars Online
              content library — real answers, no hype.
            </p>
          </motion.div>
        </div>

        {/* Chat history */}
        {messages.length > 0 && (
          <div className="w-full mb-4 space-y-3 max-h-72 overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  style={msg.role === 'user' ? { backgroundColor: '#2E7D32' } : {}}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#2E7D32' }}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rate limit CTA — shown after 5 messages */}
        {showRateLimitCTA ? (
          <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center mb-4">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              You've used your 5 free questions
            </h3>
            <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
              Join our newsletter for unlimited access to CDO AI and members-only content.
            </p>
            <LeadMagnetDialog />
          </div>
        ) : (
          <>
            {/* Input box */}
            <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
              <div className="p-4">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask about affiliate marketing, digital products, or income strategies..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full text-gray-700 text-base outline-none placeholder:text-gray-400"
                />
              </div>

              {/* Uploaded files */}
              {uploadedFiles.length > 0 && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 py-1 px-2 rounded-md border border-gray-200">
                      <FileText className="w-3 h-3" style={{ color: '#2E7D32' }} />
                      <span className="text-xs text-gray-700">{file}</span>
                      <button
                        onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== index))}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Remove file"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom toolbar */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                    <Sparkles className="w-3 h-3" />
                    <span>CDO AI</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUploadFile}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Upload file"
                  >
                    {showUploadAnimation ? (
                      <motion.div className="flex space-x-0.5"
                        initial="hidden" animate="visible"
                        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: '#2E7D32' }}
                            variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, repeat: Infinity, repeatType: 'mirror', delay: i * 0.1 } } }}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="w-8 h-8 flex items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: inputValue.trim() && !isTyping ? '#2E7D32' : '#e5e7eb',
                      color: inputValue.trim() && !isTyping ? 'white' : '#9ca3af',
                    }}
                    aria-label="Send message"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category buttons */}
            <div className="w-full grid grid-cols-3 gap-3 mb-4">
              <CommandButton
                icon={<TrendingUp className="w-5 h-5" />}
                label="Income Ideas"
                isActive={activeCommandCategory === 'income'}
                onClick={() => setActiveCommandCategory(activeCommandCategory === 'income' ? null : 'income')}
              />
              <CommandButton
                icon={<ShoppingBag className="w-5 h-5" />}
                label="Affiliate"
                isActive={activeCommandCategory === 'affiliate'}
                onClick={() => setActiveCommandCategory(activeCommandCategory === 'affiliate' ? null : 'affiliate')}
              />
              <CommandButton
                icon={<Video className="w-5 h-5" />}
                label="Digital Products"
                isActive={activeCommandCategory === 'digital'}
                onClick={() => setActiveCommandCategory(activeCommandCategory === 'digital' ? null : 'digital')}
              />
            </div>

            {/* Suggestion list */}
            <AnimatePresence>
              {activeCommandCategory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full mb-6 overflow-hidden"
                >
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-3 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700">
                        {activeCommandCategory === 'income'
                          ? 'Income strategy questions'
                          : activeCommandCategory === 'affiliate'
                          ? 'Affiliate marketing questions'
                          : 'Digital product questions'}
                      </h3>
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {commandSuggestions[activeCommandCategory].map((suggestion, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => handleCommandSelect(suggestion)}
                          className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#2E7D32' }} />
                            <span className="text-sm text-gray-700">{suggestion}</span>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        <p className="text-xs text-gray-400 text-center mt-2">
          AI responses are for educational purposes only. Not financial advice.{' '}
          <a href="/disclaimer" className="underline text-gray-400">Disclaimer</a>.
        </p>
      </div>
    </div>
  )
}

/* ── Command category button ────────────────────────────────────────── */
interface CommandButtonProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}

function CommandButton({ icon, label, isActive, onClick }: CommandButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
        isActive
          ? 'border-brand-green-200 shadow-sm'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
      style={isActive ? { backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' } : {}}
    >
      <div style={{ color: isActive ? '#2E7D32' : '#6b7280' }}>{icon}</div>
      <span className="text-sm font-medium" style={{ color: isActive ? '#1B5E20' : '#374151' }}>
        {label}
      </span>
    </motion.button>
  )
}
```

- [ ] **Step 2: Run the build to verify no TypeScript errors**

```bash
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/ai-assistant-interface.tsx
git commit -m "feat: wire AI chatbot to streaming endpoint with session rate limit"
```

---

## Task 5: End-to-End Manual Test

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Open the homepage in a browser**

Navigate to `http://localhost:4321` and scroll to the CDO AI section.

- [ ] **Step 3: Test streaming**

Type a question (e.g. "How do I start affiliate marketing?") and press Enter or click the send button. Verify:
- Typing dots appear immediately
- First token appears and typing dots disappear
- Text streams in word by word
- Response is concise (3–5 sentences)

- [ ] **Step 4: Test scope enforcement**

Type an off-topic question (e.g. "What is the weather today?"). Verify the response politely redirects to CDO topics.

- [ ] **Step 5: Test the rate limit**

Send 5 questions. After the 5th completes, verify:
- Input area disappears
- Rate limit CTA appears with the text "You've used your 5 free questions"
- "Get the Free Guide" button opens the LeadMagnetDialog

- [ ] **Step 6: Test session persistence**

Refresh the page. Verify the rate limit CTA is still shown (count persists in sessionStorage). Open a new tab to the same URL and verify the input is available again (sessionStorage is per-tab).

- [ ] **Step 7: Test error state**

Temporarily set `ANTHROPIC_API_KEY=invalid_key` in `.env.local`, restart the dev server, and send a message. Verify the assistant shows the friendly error message rather than a raw error. Restore the real key when done.

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "feat: CDO AI chatbot backend complete — streaming, session cap, newsletter CTA"
```

---

## Vercel Deployment Note

Before deploying to Vercel, swap the adapter:

```bash
npm uninstall @astrojs/node
npm install @astrojs/vercel
```

Update `astro.config.mjs`:

```diff
- import node from '@astrojs/node'
+ import vercel from '@astrojs/vercel/serverless'

  export default defineConfig({
    output: 'hybrid',
-   adapter: node({ mode: 'standalone' }),
+   adapter: vercel(),
```

Then add `ANTHROPIC_API_KEY` as an environment variable in the Vercel project dashboard (Settings → Environment Variables).
