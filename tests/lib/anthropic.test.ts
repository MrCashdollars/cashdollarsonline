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

describe('SYSTEM_PROMPT content', () => {
  it('bans the anti-hype words listed in CLAUDE.md §8', () => {
    expect(SYSTEM_PROMPT).toContain('"easy"')
    expect(SYSTEM_PROMPT).toContain('"guaranteed"')
    expect(SYSTEM_PROMPT).toContain('"passive"')
    expect(SYSTEM_PROMPT).toContain('"secret"')
  })

  it('requires no financial advice disclaimer', () => {
    expect(SYSTEM_PROMPT).toContain('No financial advice')
  })

  it('includes the off-topic redirect instruction', () => {
    expect(SYSTEM_PROMPT).toContain("I'm focused on CashDollarsOnline content and can't help with that")
  })

  it('limits response length to 3–5 sentences', () => {
    expect(SYSTEM_PROMPT).toContain('3–5 sentences')
  })
})
