import { site } from '../src/content/site'
import { skillGroups } from '../src/content/skills'
import type { PageKey } from '../src/content/types'

const escapeAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** The site root as an absolute URL ending in "/", or undefined if unset/invalid. */
function normaliseSiteUrl(siteUrl: string | undefined): string | undefined {
  if (!siteUrl) return undefined
  try {
    const url = new URL('/', siteUrl)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : undefined
  } catch {
    return undefined
  }
}

/** The environment's VITE_SITE_URL if it has one, otherwise the address in site.ts. */
export function siteUrlFrom(envValue: string | undefined): string {
  const trimmed = envValue?.trim()
  return trimmed ? trimmed : site.url
}

/** Which page an html entry file is, from its path (either kind of separator). */
export function pageKeyFor(filename: string): PageKey {
  return filename.replace(/\\/g, '/').includes('/work/healthcare/') ? 'healthcare' : 'home'
}

/** Tags that need the absolute site URL. Empty when it is not known. */
export function headTags(siteUrl: string | undefined, path = '/'): string {
  const root = normaliseSiteUrl(siteUrl)
  if (!root) return ''
  const pageUrl = `${root}${path.replace(/^\//, '')}`
  const imagePath = Object.values(site.pages).find((p) => p.path === path)?.image ?? site.pages.home.image
  const image = `${root}${imagePath.replace(/^\//, '')}`
  return [
    `<link rel="canonical" href="${pageUrl}" />`,
    `<meta property="og:url" content="${pageUrl}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join('\n    ')
}

/** Description and social-card tags for a page; they do not depend on the site URL. */
export function metaTags(page: PageKey = 'home'): string {
  const meta = site.pages[page]
  const title = escapeAttr(meta.title)
  const description = escapeAttr(meta.description)
  return [
    `<meta name="description" content="${description}" />`,
    `<meta property="og:type" content="${page === 'home' ? 'website' : 'article'}" />`,
    `<meta property="og:site_name" content="${escapeAttr(site.name)}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
  ].join('\n    ')
}

export function buildSitemap(siteUrl: string | undefined): string | null {
  const root = normaliseSiteUrl(siteUrl)
  if (!root) return null
  const urls = Object.values(site.pages)
    .map((p) => `  <url><loc>${root}${p.path.replace(/^\//, '')}</loc></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

export function buildRobots(siteUrl: string | undefined): string {
  const root = normaliseSiteUrl(siteUrl)
  return `User-agent: *\nAllow: /\n${root ? `\nSitemap: ${root}sitemap.xml\n` : ''}`
}

/** schema.org data for a page (Person for home, Article for the case study), safe inside a <script> tag. */
export function buildJsonLd(page: PageKey = 'home'): string {
  const person = {
    '@type': 'Person',
    name: site.name,
    url: site.url,
    sameAs: [site.github, site.linkedin],
  }
  const data =
    page === 'home'
      ? {
          '@context': 'https://schema.org',
          ...person,
          jobTitle: 'Java Backend Developer',
          description: site.description,
          address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
          knowsAbout: skillGroups.flatMap((g) => g.items),
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: site.pages[page].title,
          description: site.pages[page].description,
          url: `${site.url}${site.pages[page].path}`,
          author: person,
        }
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/** Shown only when JavaScript is off. */
export function noscriptBlock(): string {
  return `<noscript>
      <p style="max-width:40rem;margin:4rem auto;padding:0 1rem;font-family:system-ui,sans-serif;line-height:1.6;color:#e6eaf2">
        This site needs JavaScript to display. You can still reach me by email at
        <a href="mailto:${site.email}" style="color:#2dd4bf">${site.email}</a>.
      </p>
    </noscript>`
}
