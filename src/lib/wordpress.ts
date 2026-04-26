// WordPress REST API client
// Pulls from the Hostinger WordPress install used as a headless CMS.
// No authentication required — all fetched posts are public.

const WP_API =
  import.meta.env.WORDPRESS_API_URL ??
  'https://magenta-bear-949779.hostingersite.com/wp-json/wp/v2'

export interface WPPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  modified: string
  featuredImageUrl: string | null
  categories: string[]
  readingTimeMinutes: number
}

export interface WPCategory {
  id: number
  name: string
  slug: string
  count: number
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8230;/g, '…')
    .trim()
}

export function estimateReadingTime(html: string): number {
  const words = html
    .replace(/<[^>]+>/g, '')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function mapPost(raw: any): WPPost {
  const featuredMedia = raw._embedded?.['wp:featuredmedia']?.[0]
  const featuredImageUrl =
    featuredMedia?.media_details?.sizes?.medium_large?.source_url ??
    featuredMedia?.source_url ??
    null

  const termGroups: any[][] = raw._embedded?.['wp:term'] ?? []
  const categories = (termGroups[0] ?? [])
    .filter((c: any) => c.name !== 'Uncategorized')
    .map((c: any) => c.name as string)

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title?.rendered ?? '',
    excerpt: stripHtml(raw.excerpt?.rendered ?? ''),
    content: raw.content?.rendered ?? '',
    date: raw.date,
    modified: raw.modified,
    featuredImageUrl,
    categories,
    readingTimeMinutes: estimateReadingTime(raw.content?.rendered ?? ''),
  }
}

export async function getRecentPosts(count = 3): Promise<WPPost[]> {
  try {
    const res = await fetch(`${WP_API}/posts?per_page=${count}&_embed=true`)
    if (!res.ok) return []
    return (await res.json() as any[]).map(mapPost)
  } catch {
    return []
  }
}

export async function getAllPosts(): Promise<WPPost[]> {
  const posts: WPPost[] = []
  let page = 1
  try {
    while (true) {
      const res = await fetch(`${WP_API}/posts?per_page=100&page=${page}&_embed=true`)
      if (!res.ok) break
      const data: any[] = await res.json()
      posts.push(...data.map(mapPost))
      const totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10)
      if (page >= totalPages) break
      page++
    }
  } catch {
    // return whatever we collected
  }
  return posts
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(`${WP_API}/posts?slug=${encodeURIComponent(slug)}&_embed=true`)
    if (!res.ok) return null
    const data: any[] = await res.json()
    return data.length ? mapPost(data[0]) : null
  } catch {
    return null
  }
}

export async function getCategories(): Promise<WPCategory[]> {
  try {
    const res = await fetch(`${WP_API}/categories?per_page=50`)
    if (!res.ok) return []
    const data: any[] = await res.json()
    return data
      .filter((c) => c.name !== 'Uncategorized' && c.count > 0)
      .map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c.count }))
  } catch {
    return []
  }
}
