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
