// SendFox email capture integration
// Docs: https://sendfox.com/developers
// API key: SENDFOX_API_KEY (env var, never commit)
// List ID: SENDFOX_LIST_ID (env var)
//
// Usage: call subscribeToList() from an API route or server-side Astro action
// Never call from client-side code — it would expose your API key

const API_KEY = import.meta.env.SENDFOX_API_KEY
const LIST_ID = import.meta.env.SENDFOX_LIST_ID
const BASE_URL = 'https://api.sendfox.com'

export interface SubscribePayload {
  email: string
  firstName?: string
  /** Override the default list ID for different lead magnet lists */
  listId?: string
}

export interface SubscribeResult {
  success: boolean
  /** User-facing message — safe to display */
  message: string
  /** HTTP status from SendFox */
  status?: number
}

/**
 * Subscribe an email to a SendFox list.
 * Call this from a server-side Astro action or API route — never from client code.
 *
 * CAN-SPAM/GDPR: form must be clearly opt-in with no pre-checked boxes.
 * Every email must include an unsubscribe link (SendFox handles this).
 */
export async function subscribeToList(payload: SubscribePayload): Promise<SubscribeResult> {
  // TODO: implement
  // POST /contacts with { email, first_name, lists: [listId] }
  // Handle 422 (already subscribed) gracefully — treat as success
  // Handle rate limits and network errors
  throw new Error('Not implemented — set SENDFOX_API_KEY and SENDFOX_LIST_ID in .env.local')
}

/**
 * Check if an email is already subscribed.
 * Use to avoid duplicate subscribe attempts.
 */
export async function isSubscribed(email: string): Promise<boolean> {
  // TODO: implement
  // GET /contacts?email={email}
  throw new Error('Not implemented')
}
