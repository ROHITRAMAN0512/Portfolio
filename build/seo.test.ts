import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { site } from '../src/content/site'
import { buildJsonLd, buildRobots, buildSitemap, headTags, metaTags, noscriptBlock, siteUrlFrom } from './seo'

describe('siteUrlFrom', () => {
  test('falls back to the address in site.ts when the environment value is missing or blank', () => {
    expect(siteUrlFrom(undefined)).toBe(site.url)
    expect(siteUrlFrom('')).toBe(site.url)
    expect(siteUrlFrom('   ')).toBe(site.url)
  })

  test('lets an environment value override it', () => {
    expect(siteUrlFrom(' https://my-domain.example ')).toBe('https://my-domain.example')
  })

  test('with no environment value, the share-preview tags and sitemap are still produced', () => {
    const tags = headTags(siteUrlFrom(undefined))
    expect(tags).toContain(`property="og:image" content="${site.url}/og-image.png"`)
    expect(tags).toContain(`rel="canonical" href="${site.url}/"`)
    expect(buildSitemap(siteUrlFrom(undefined))).toContain(`<loc>${site.url}/</loc>`)
  })
})

describe('headTags', () => {
  test('is empty when no site URL is set', () => {
    expect(headTags(undefined)).toBe('')
  })

  test('is empty when the site URL is not a valid http(s) URL', () => {
    expect(headTags('not a url')).toBe('')
    expect(headTags('ftp://example.com')).toBe('')
  })

  test('adds canonical, og:url and absolute image tags, normalising the URL', () => {
    const tags = headTags('https://example.com')
    expect(tags).toContain('rel="canonical" href="https://example.com/"')
    expect(tags).toContain('property="og:url" content="https://example.com/"')
    expect(tags).toContain('property="og:image" content="https://example.com/og-image.png"')
    expect(tags).toContain('name="twitter:image" content="https://example.com/og-image.png"')
  })
})

describe('buildSitemap', () => {
  test('is null when no site URL is set', () => {
    expect(buildSitemap(undefined)).toBeNull()
  })

  test('has exactly one <loc> for the site root', () => {
    const xml = buildSitemap('https://example.com/')
    expect(xml).not.toBeNull()
    expect(xml!.match(/<loc>/g)).toHaveLength(1)
    expect(xml).toContain('<loc>https://example.com/</loc>')
  })
})

describe('buildRobots', () => {
  test('allows everything and omits the sitemap line without a URL', () => {
    const txt = buildRobots(undefined)
    expect(txt).toContain('User-agent: *')
    expect(txt).toContain('Allow: /')
    expect(txt).not.toContain('Sitemap:')
  })

  test('points at the sitemap when a URL is set', () => {
    expect(buildRobots('https://example.com')).toContain('Sitemap: https://example.com/sitemap.xml')
  })
})

describe('buildJsonLd', () => {
  const data = JSON.parse(buildJsonLd())

  test('is a schema.org Person with both profile links', () => {
    expect(data['@type']).toBe('Person')
    expect(data.name).toBe(site.name)
    expect(data.sameAs).toEqual(expect.arrayContaining([site.github, site.linkedin]))
  })

  test('points at the site address', () => {
    expect(data.url).toBe(site.url)
  })

  test('lists skills and has no ratings or reviews', () => {
    expect(data.knowsAbout).toEqual(expect.arrayContaining(['Java', 'Spring Boot', 'PostgreSQL']))
    expect(JSON.stringify(data)).not.toMatch(/rating|review/i)
  })

  test('cannot break out of its script tag', () => {
    expect(buildJsonLd()).not.toContain('<')
  })
})

describe('metaTags and noscriptBlock', () => {
  test('metaTags carries the description and social card tags', () => {
    const tags = metaTags()
    expect(tags).toContain(`name="description" content="${site.description}"`)
    expect(tags).toContain('property="og:title"')
    expect(tags).toContain('name="twitter:card" content="summary_large_image"')
  })

  test('noscriptBlock tells people JavaScript is needed and gives an email link', () => {
    const block = noscriptBlock()
    expect(block).toContain('JavaScript')
    expect(block).toContain(`href="mailto:${site.email}"`)
  })
})

describe('index.html', () => {
  test('its <title> equals the approved site title', () => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
    expect(html).toContain(`<title>${site.title}</title>`)
  })
})
