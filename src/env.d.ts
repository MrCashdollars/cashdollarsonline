/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  // YouTube Data API v3 — never expose in client-side code
  readonly YOUTUBE_API_KEY: string
  readonly YOUTUBE_CHANNEL_ID: string

  // WordPress REST API (public endpoint, no auth)
  readonly WORDPRESS_API_URL: string

  // SendFox email capture
  readonly SENDFOX_API_KEY: string
  readonly SENDFOX_LIST_ID: string

  // Plausible Analytics — PUBLIC_ prefix makes this safe to expose in browser
  readonly PUBLIC_SITE_URL: string
  readonly PLAUSIBLE_DOMAIN: string
  readonly PLAUSIBLE_API_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
