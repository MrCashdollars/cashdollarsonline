# Homepage blog motion and creator scene — 2026-10-02

## Scope

The owner requested a right-to-left article gallery with perspective depth, and their avatar seated to the left of the blog section, facing right and typing on a branded laptop. A separate black panel displays white motivational text. The earlier hero spacing and YouTube placeholder changes remain intact.

The existing avatar references were used to generate a transparent two-frame sprite. The original logo and correctly spelled CashDollarsOnline wordmark are overlaid on the laptop lid. The sprite is WebP, 1774 × 887, with transparency, 199,128 bytes. No new runtime dependency was added.

Message: “Stop chasing shortcuts. Build a skill. Solve a real problem. Create something worth paying for. One honest step at a time. We don’t sell dreams. We provide roadmaps.” It types at 65ms per character, holds for 6.5 seconds, then repeats while visible. Hand motion runs while text types. Full text is available to assistive technology without announcing each character.

The gallery completes a horizontal cycle in 28 seconds. Each image and caption move as one unit. Hover, keyboard focus, manual pause, offscreen state, and hidden document state suspend motion. Keyboard focus brings the chosen card to the foreground. Reduced motion shows a static grid and the complete message. An inline noscript fallback keeps all previews readable on touch devices without JavaScript.

## Content finding

The existing three homepage article slugs do not exist in the connected WordPress CMS; its public API currently returns only the starter “Hello world!” post. These cards are now explicitly labeled Draft preview, with a Browse the blog destination pointing to /blog. They do not claim that the sample articles are published. Publishing the actual articles remains separate editorial work.

## Verification

- Vitest: 12 tests passed, including direction, horizontal path, depth, spacing and loop geometry.
- Astro/TypeScript: zero errors, zero warnings; 17 existing hints.
- Production build completed; existing runtime patch sets nodejs22.x.
- Chromium checks at 1920, 1440, 1024, 768, 390 and 360 pixels: equal left/right layout gutters and no horizontal page overflow.
- Observed card moving left: center transform x changed from −2.12px to −30.35px over 650ms. Avatar background changed from frame 0 to frame 1; text advanced from “S” to “Stop chasin”.
- Manual pause stopped both transform and text updates; hover and keyboard focus paused motion. Keyboard Tab centered the focused card with a visible outline; Enter opened the blog listing.
- Message sizing layer reserved the complete text height, preventing panel growth during typing.
- Mobile depth layout before and after hydration: same section height 1369.28px, gallery 370px, message panel 241px. Slow hydration does not switch from a tall stacked grid to a short gallery. The noscript grid is used only when JavaScript is disabled.
- JavaScript disabled at 390px: all three cards fully fit horizontally (left32/right343 within375px client width), no overflow, complete message and four usable blog links.
- Reduced motion toggled after animation began: all cards transform none/opacity1; avatar animation none. Resets previously assigned inline transforms.
- Fresh built-page context: zero browser errors and zero warnings. Original logo and three existing article images loaded; sprite endpoint returned200. Complete message held, then replayed. Six-and-a-half-second reading pause verified.
- Screenshots inspected: research-output/blog-built-desktop.png and research-output/blog-built-mobile.png in the parent business workspace.
- Independent read-only review identified reduced-motion transition and no-JS touch readability issues; both were fixed and browser verified.

## Limits and rollout

This verifies the requested homepage changes, not unrelated newsletter delivery, live AI provider access, video integration, draft article publication, or all pages in the broader redesign. No real phone or Safari test was performed. The built static server cannot serve the SSR blog endpoint; blog navigation was checked through Astro's development server.

Work remains on codex/homepage-spacing. Nothing has been pushed, merged, or deployed. Owner approval is required before production deployment under the project handover. Preview: http://127.0.0.1:4321/#blog-spotlight-heading. To roll back this feature, revert its dedicated feature commit; the earlier spacing/YouTube commits can remain.
