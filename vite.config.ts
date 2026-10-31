import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { site } from './src/content/site'
import {
  buildJsonLd,
  buildRobots,
  buildSitemap,
  headTags,
  metaTags,
  noscriptBlock,
  pageKeyFor,
  siteUrlFrom,
} from './build/seo'

const PRELOADED_FONTS = /(instrument-serif-latin-400-normal|inter-latin-wght-normal)-[\w-]+\.woff2$/

/** Fills the SEO placeholders in each html page and emits sitemap.xml / robots.txt. */
function seoPlugin(siteUrl: string | undefined): Plugin {
  return {
    name: 'portfolio-seo',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const page = pageKeyFor(ctx.filename)
        const fontPreloads = Object.keys(ctx.bundle ?? {})
          .filter((file) => PRELOADED_FONTS.test(file))
          .map((file) => `<link rel="preload" as="font" type="font/woff2" href="/${file}" crossorigin />`)
          .join('\n    ')
        const head = [headTags(siteUrl, site.pages[page].path), fontPreloads].filter(Boolean).join('\n    ')
        // Function replacers: a "$" in the text must never be read as a replacement pattern.
        return html
          .replace('<!--seo-meta-->', () => metaTags(page))
          .replace('<!--seo-head-->', () => head)
          .replace('<!--json-ld-->', () => `<script type="application/ld+json">${buildJsonLd(page)}</script>`)
          .replace('<!--noscript-->', () => noscriptBlock())
      },
    },
    generateBundle() {
      const sitemap = buildSitemap(siteUrl)
      if (sitemap) this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobots(siteUrl) })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), tailwindcss(), seoPlugin(siteUrlFrom(env.VITE_SITE_URL))],
    build: {
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL('./index.html', import.meta.url)),
          healthcare: fileURLToPath(new URL('./work/healthcare/index.html', import.meta.url)),
        },
      },
    },
    // Native file events were missed on this machine's drive; polling is dev-only.
    server: { watch: { usePolling: true, interval: 300 } },
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts', 'build/**/*.test.ts'],
    },
  }
})
