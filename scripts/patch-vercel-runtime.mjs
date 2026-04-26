// Post-build patch: @astrojs/vercel v7 hardcodes nodejs18.x (EOL Apr 2025).
// This script rewrites the runtime to nodejs20.x after every astro build.
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const configPath = resolve('.vercel/output/functions/_render.func/.vc-config.json')

try {
  const config = JSON.parse(readFileSync(configPath, 'utf8'))
  const before = config.runtime
  config.runtime = 'nodejs20.x'
  writeFileSync(configPath, JSON.stringify(config, null, '\t'))
  console.log(`✓ Patched Vercel runtime: ${before} → nodejs20.x`)
} catch (err) {
  console.error('patch-vercel-runtime: failed —', err.message)
  process.exit(1)
}
