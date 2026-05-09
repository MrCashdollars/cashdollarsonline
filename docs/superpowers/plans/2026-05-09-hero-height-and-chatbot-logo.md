# Hero Height Reduction & Chatbot Logo Swap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shorten the PrismaHero from full-screen to auto-height, and replace the placeholder DollarSign icon above "Ask Me Anything" with the real CDO logo displayed as a circle.

**Architecture:** Two independent single-file edits — no new files, no new dependencies. Each task stands alone and can be verified visually in the browser after the dev server is running.

**Tech Stack:** Astro 4, React (TSX), Tailwind CSS. Dev server: `npm run dev` → `http://localhost:4321`.

---

## File Map

| File | Change |
|---|---|
| `src/components/ui/prisma-hero.tsx` | Remove fixed height inline style; add `py-20 sm:py-28` to `<section>`; remove `h-full` from inner `<div>` |
| `src/components/ui/ai-assistant-interface.tsx` | Replace `<div>` + `<DollarSign>` block (lines 192–195) with `<img src="/logo.png" ...>` |

---

## Task 1: Shorten the hero section to auto-height

**Files:**
- Modify: `src/components/ui/prisma-hero.tsx` (line 94–95)

- [ ] **Step 1: Open the file and locate the section element**

  In `src/components/ui/prisma-hero.tsx`, find line 94:

  ```tsx
  <section className="w-full" style={{ height: 'calc(100vh - 4rem)' }}>
    <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">
  ```

- [ ] **Step 2: Apply the fix**

  Replace those two lines with:

  ```tsx
  <section className="w-full py-20 sm:py-28">
    <div className="relative w-full overflow-hidden rounded-2xl md:rounded-[2rem]">
  ```

  Exact changes:
  - `<section>`: remove `style={{ height: 'calc(100vh - 4rem)' }}`, add `py-20 sm:py-28`
  - `<div>`: remove `h-full` (the div no longer needs to stretch to a parent height)

- [ ] **Step 3: Start the dev server and verify visually**

  ```bash
  npm run dev
  ```

  Open `http://localhost:4321` in the browser. The hero should now:
  - Be noticeably shorter than the full viewport
  - Show the "Cash Dollars Online" text and value prop + buttons with comfortable padding above and below
  - Have no large empty gap at the top
  - Background gradient, diagonal split, and $ pattern texture should all look correct

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/ui/prisma-hero.tsx
  git commit -m "fix: shorten hero to auto-height with vertical padding"
  ```

---

## Task 2: Replace DollarSign icon with real CDO logo in AI chatbot

**Files:**
- Modify: `src/components/ui/ai-assistant-interface.tsx` (lines 192–195)

- [ ] **Step 1: Open the file and locate the icon block**

  In `src/components/ui/ai-assistant-interface.tsx`, find lines 192–195:

  ```tsx
  {/* CDO coin icon */}
  <div className="mb-6 w-16 h-16 rounded-full flex items-center justify-center"
    style={{ backgroundColor: '#2E7D32' }}>
    <DollarSign className="w-8 h-8 text-white" />
  </div>
  ```

- [ ] **Step 2: Apply the fix**

  Replace that entire block with:

  ```tsx
  {/* CDO logo */}
  <img
    src="/logo.png"
    alt="Cash Dollars Online"
    className="mb-6 w-16 h-16 rounded-full object-cover"
  />
  ```

  - `rounded-full` crops the square logo into a circle
  - `object-cover` fills the circle without stretching or letterboxing
  - `w-16 h-16` keeps the same 64×64px size as before
  - `mb-6` keeps the same spacing below the logo

- [ ] **Step 3: Remove unused DollarSign import (if no longer used elsewhere)**

  Check the top of the file for:

  ```tsx
  import {
    Search,
    ArrowUp,
    Plus,
    FileText,
    TrendingUp,
    ShoppingBag,
    Video,
    DollarSign,
    Sparkles,
  } from 'lucide-react'
  ```

  Remove `DollarSign,` from this import list since it is no longer used. Result:

  ```tsx
  import {
    Search,
    ArrowUp,
    Plus,
    FileText,
    TrendingUp,
    ShoppingBag,
    Video,
    Sparkles,
  } from 'lucide-react'
  ```

- [ ] **Step 4: Verify visually in the browser**

  With the dev server still running at `http://localhost:4321`, scroll down to the "Ask Me Anything" section. Confirm:
  - The CDO logo appears above "Ask Me Anything" as a circle
  - It is the same size as the old green circle (64×64px)
  - No TypeScript or lint errors in the terminal

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/ui/ai-assistant-interface.tsx
  git commit -m "fix: replace DollarSign placeholder with real CDO logo in AI chatbot"
  ```

---

## Self-Review

**Spec coverage:**
- Hero auto-height → Task 1 ✓
- Logo swap to circle → Task 2 ✓
- No new dependencies introduced ✓

**Placeholder scan:** No TBDs, no "add appropriate handling", all steps show exact code.

**Type consistency:** No new types introduced. `<img>` is standard JSX. Import removal is clean.
