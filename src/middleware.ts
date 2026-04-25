import { defineMiddleware } from 'astro:middleware'

// Pass-through middleware — required to prevent @astrojs/react resolver
// from hijacking the middleware module resolution in Vite 5 dev mode.
export const onRequest = defineMiddleware((_context, next) => next())
