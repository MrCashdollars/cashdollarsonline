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
