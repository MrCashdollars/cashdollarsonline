// YouTube Data API v3 client
// Docs: https://developers.google.com/youtube/v3/docs
// Quota: 10,000 units/day on free tier — cache aggressively
// API key: YOUTUBE_API_KEY (env var, never commit)
// Channel: @cashdollarsonline2195

const API_KEY = import.meta.env.YOUTUBE_API_KEY
const CHANNEL_ID = import.meta.env.YOUTUBE_CHANNEL_ID
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  /** ISO 8601 duration — convert with parseDuration() */
  duration: string
  /** Display-formatted duration, e.g. "12:34" */
  durationLabel: string
  viewCount: string
  url: string
  /** Series tag: 'foundation' | 'affiliate' | 'digital-products' | 'other' */
  series: string
}

/**
 * Fetch the latest videos from the channel upload playlist.
 * Called at build time — Astro ISR revalidates hourly via revalidate option.
 */
export async function getLatestVideos(maxResults = 12): Promise<YouTubeVideo[]> {
  // TODO: implement
  // 1. GET channels?id=CHANNEL_ID&part=contentDetails to get upload playlist ID
  // 2. GET playlistItems?playlistId=...&maxResults=maxResults&part=snippet to get video IDs + metadata
  // 3. GET videos?id=...&part=statistics,contentDetails to get view counts + duration
  // 4. Map to YouTubeVideo[]
  throw new Error('Not implemented — set YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID in .env.local')
}

/**
 * Get a single featured/pinned video for the homepage embed.
 * Returns the most recent video if no pin is set.
 */
export async function getFeaturedVideo(): Promise<YouTubeVideo | null> {
  // TODO: implement — either pin a specific video ID or return getLatestVideos(1)[0]
  throw new Error('Not implemented')
}

/**
 * Fetch all videos from a specific playlist (used for series pages).
 */
export async function getVideosByPlaylist(playlistId: string): Promise<YouTubeVideo[]> {
  // TODO: implement — same approach as getLatestVideos but with a specific playlistId
  throw new Error('Not implemented')
}

/** Parse ISO 8601 duration (PT12M34S) to a display label "12:34" */
export function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '0:00'
  const h = parseInt(match[1] ?? '0')
  const m = parseInt(match[2] ?? '0')
  const s = parseInt(match[3] ?? '0')
  const mm = String(m).padStart(h > 0 ? 2 : 1, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}
