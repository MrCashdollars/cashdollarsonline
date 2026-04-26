import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel/serverless'
import { fileURLToPath } from 'url'

export default defineConfig({
  site: 'https://cashdollarsonline.com',
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap(),
  ],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    resolve: {
      alias: {
        // mirrors tsconfig paths so @/lib/utils etc. resolve at bundle time
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      {
        name: 'fix-astro-react-opts-hooks',
        enforce: 'pre',
        configResolved(config) {
          // @astrojs/react:opts uses Rolldown filter-based hook syntax
          // ({ filter: {...}, handler() {...} }). In non-Rolldown Vite 5,
          // getHookHandler() extracts only the handler, stripping the filter.
          // Both resolveId and load hooks then run for EVERY module, hijacking
          // imports and causing `sequence` to be unavailable from astro:middleware.
          // Fix: patch both hooks to guard on the expected virtual module IDs.
          const virtualModule = 'astro:react:opts'
          const virtualModuleId = '\0astro:react:opts'

          // config.plugins is the flat sorted plugin list
          const found = config.plugins.find(p => p.name === '@astrojs/react:opts')
          if (found) {
            if (found.resolveId) {
              const origResolveHandler = typeof found.resolveId === 'object'
                ? found.resolveId.handler
                : found.resolveId
              found.resolveId = function(id, ...args) {
                if (id !== virtualModule && id !== virtualModuleId) return
                return origResolveHandler.call(this, id, ...args)
              }
            }
            if (found.load) {
              const origLoadHandler = typeof found.load === 'object'
                ? found.load.handler
                : found.load
              found.load = function(id, ...args) {
                if (id !== virtualModuleId) return
                return origLoadHandler.call(this, id, ...args)
              }
            }
          }
        },
      },
    ],
  },
})
