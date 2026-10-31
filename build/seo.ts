import { site } from '../src/content/site'
import { skillGroups } from '../src/content/skills'

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

/** Tags that need the absolute site URL. Empty when it is not known. */
export function headTags(siteUrl: string | undefined): string {
  const root = normaliseSiteUrl(siteUrl)
  if (!root) return ''
  const image = `${root}og-image.png`
  return [
    `<link rel="canonical" href="${root}" />`,
    `<meta property="og:url" content="${root}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join('\n    ')
}

/** Description and social-card tags that do not depend on the site URL. */
export function metaTags(): string {
  const title = escapeAttr(site.title)
  const description = escapeAttr(site.description)
  return [
    `<meta name="description" content="${description}" />`,
    `<meta property="og:type" content="website" />`,
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
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${root}</loc></url>
</urlset>
`
}

export function buildRobots(siteUrl: string | undefined): string {
  const root = normaliseSiteUrl(siteUrl)
  return `User-agent: *\nAllow: /\n${root ? `\nSitemap: ${root}sitemap.xml\n` : ''}`
}

/** schema.org Person as a JSON string that is safe inside a <script> tag. */
export function buildJsonLd(): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: 'Java Backend Developer',
    description: site.description,
    address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
    knowsAbout: skillGroups.flatMap((g) => g.items),
    sameAs: [site.github, site.linkedin],
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
