# Design Spec: Hero Height Reduction & Chatbot Logo Swap

**Date:** 2026-05-09
**Status:** Approved

---

## Summary

Two targeted visual fixes to the homepage:

1. Shorten the PrismaHero section from full-screen to auto-height (content-driven).
2. Replace the placeholder DollarSign icon in the AI chatbot with the real CDO logo displayed as a circle.

---

## Change 1 — Hero Height Reduction

**File:** `src/components/ui/prisma-hero.tsx`

**Problem:** The hero `<section>` uses `style={{ height: 'calc(100vh - 4rem)' }}`, forcing it to fill the entire viewport. This leaves a large empty gap above the content (brand name + value prop + buttons), which the user wants removed.

**Solution:** Remove the fixed inline height style and apply Tailwind padding classes `py-20 sm:py-28` to the `<section>`. The inner `<div>` currently relies on `h-full` for its height — remove that too so the div sizes naturally to its content. All visual styling (background gradient, diagonal clip, $ pattern texture, rounded corners) is unchanged.

**Result:** The hero wraps snugly around its content with top/bottom breathing room. No empty dead space above the brand name.

---

## Change 2 — Chatbot Logo Swap

**File:** `src/components/ui/ai-assistant-interface.tsx`

**Problem:** Lines 192–195 render a plain green circle with a lucide-react `<DollarSign>` icon above the "Ask Me Anything" heading. The user wants this replaced with the real CDO logo (`/logo.png`), displayed as a circle.

**Solution:** Replace the `<div>` + `<DollarSign>` block with a single `<img>` tag:

- `src="/logo.png"` — the real CDO logo already in `public/`
- `alt="Cash Dollars Online"`
- `className="mb-6 w-16 h-16 rounded-full object-cover"` — circle crop, same size as before

**Result:** The chatbot section shows the actual brand logo instead of a generic icon, consistent with the logo used in the nav.

---

## Files Changed

| File | Change |
|---|---|
| `src/components/ui/prisma-hero.tsx` | Remove fixed height, add `py-20 sm:py-28` padding |
| `src/components/ui/ai-assistant-interface.tsx` | Swap `DollarSign` circle for `<img>` with `rounded-full` |

## Out of Scope

- No changes to content, copy, colors, or any other sections.
- No changes to mobile breakpoints or layout grid.
- No new dependencies.
