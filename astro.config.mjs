import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import { fileURLToPath } from 'url'

// https://astro.build/config
export default defineConfig({
  site: 'https://cashdollarsonline.com',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    sitemap(),
  ],
  output: 'static',
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
  },
})
