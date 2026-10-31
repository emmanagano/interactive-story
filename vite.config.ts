/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

/**
 * Social-preview tags need an absolute address. Netlify tells the build its own address in `URL`,
 * so nothing is hard-coded and a custom domain works later. Locally it is empty, which leaves
 * the tags pointing at the same site.
 */
function siteUrl(): Plugin {
  return {
    name: 'site-url',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', (process.env.URL ?? '').replace(/\/$/, '')),
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteUrl()],
  test: {
    environment: 'node', // the engine is pure TypeScript, so no DOM is needed
  },
})
