// WordPress REST API client
// Endpoint: WORDPRESS_API_URL (defaults to cashdollarsonline.com)
// No authentication required for public posts.
// Docs: https://developer.wordpress.org/rest-api/reference/posts/

const WP_API =
  import.meta.env.WORDPRESS_API_URL ?? 'https://cashdollarsonline.com/wp-json/wp/v2'

export interface WPPost {
  id: number
  slug: string
  title: string
  excerpt: string
  /** Full post HTML from WordPress */
  content: string
  /** ISO date string */
  date: string
  /** ISO date string */
  modified: string
  featuredImageUrl: string | null
  categories: string[]
  /** Estimated reading time in minutes */
  readingTimeMinutes: number
}

export interface WPCategory {
  id: number
  name: string
  slug: string
  count: number
}

/**
 * Fetch the N most recent posts for homepage / sidebar.
 */
export async function getRecentPosts(count = 3): Promise<WPPost[]> {
  // TODO: implement
  // GET /posts?per_page={count}&_embed=true (embeds featured image)
  // Map WP response to WPPost interface
  // _embed includes featured media and author data
  throw new Error('Not implemented')
}

/**
 * Fetch all posts for static path generation.
 * Paginates automatically — WP REST API returns 10 per page by default.
 */
export async function getAllPosts(): Promise<WPPost[]> {
  // TODO: implement with pagination
  // GET /posts?per_page=100&page=1 — repeat until X-WP-TotalPages is exhausted
  throw new Error('Not implemented')
}

/**
 * Fetch a single post by slug for blog/[slug].astro.
 * Returns null if the post does not exist (triggers 404).
 */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  // TODO: implement
  // GET /posts?slug={slug}&_embed=true
  throw new Error('Not implemented')
}

/**
 * Fetch all categories for the blog filter UI.
 */
export async function getCategories(): Promise<WPCategory[]> {
  // TODO: implement
  // GET /categories?per_page=50
  throw new Error('Not implemented')
}

/** Estimate reading time from HTML content string (~200 wpm) */
export function estimateReadingTime(html: string): number {
  const wordCount = html.replace(/<[^>]+>/g, '').split(/\s+/).length
  return Math.max(1, Math.round(wordCount / 200))
}
