# Website appearance correction

The Black, White, and Auto selector now lives in the shared navigation and controls the entire website. The creator message inherits the same setting. White preserves the original default. Auto follows the device preference, including changes while the page is open. The new storage key is `cdo-site-theme`; existing valid creator-screen preferences are used as a fallback. The shared head initializes the theme before paint. Logos, photos, and solid brand buttons retain their colors.

## Verification

- Before implementation, the browser regression check found zero appearance inputs in the shared header; after implementation there are three on every route.
- Browser checked Black and White across 13 routes: home, about, videos, free guides, resources, contact, privacy, terms, cookies, disclaimer, courses, blog, and `/blog/hello-world`. All 26 route/mode checks returned 200, the correct background, and the correct selection after navigation.
- Auto followed light to dark changes and survived reload. Explicit White stayed White when the device changed. Invalid storage fell back to White; legacy Auto followed Dark; blocked storage still allowed switching.
- Header and page layout checked at 1920, 1440, 1024, 1023, 768, 390, and 360 pixels. No horizontal overflow; mobile navigation and keyboard radio selection worked.
- Production build preview verified dark article cards and headings, contact inputs, creator message, and lead-magnet dialog. The article CTA retains white text on its original green background. No forms were submitted and no paid AI requests were made.
- `npm test`: 12 tests passed. `npm run typecheck`: 0 errors, 0 warnings, 17 existing hints. Production build passed and the existing runtime patch selected Node 22.
- Independent read-only review found no remaining release blockers. `git diff --check` passed.

## Release

Publish by fast-forwarding the existing GitHub production branch; its Vercel integration deploys automatically. Verify the actual www domain afterward. Previous production commit: `8e3323e3107abcc63dd3585685736843c9868e6e`.
