import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { site } from '../src/content/site'
import { buildJsonLd, buildRobots, buildSitemap, headTags, metaTags, noscriptBlock, pageKeyFor, siteUrlFrom } from './seo'

describe('pages', () => {
  test('pageKeyFor maps html files to pages, on either kind of path separator', () => {
    expect(pageKeyFor('E:/CLAUDE/portfolio/index.html')).toBe('home')
    expect(pageKeyFor('/index.html')).toBe('home')
    expect(pageKeyFor('E:\\CLAUDE\\portfolio\\work\\healthcare\\index.html')).toBe('healthcare')
    expect(pageKeyFor('/work/healthcare/index.html')).toBe('healthcare')
  })

  test('every page has a unique slash-terminated path, a title and a description of at most 155 characters', () => {
    const all = Object.values(site.pages)
    expect(new Set(all.map((p) => p.path)).size).toBe(all.length)
    for (const p of all) {
      expect(p.path.startsWith('/') && p.path.endsWith('/')).toBe(true)
      expect(p.title.trim()).not.toBe('')
      expect(p.description.length).toBeGreaterThan(0)
      expect(p.description.length).toBeLessThanOrEqual(155)
    }
  })

  test('the home page keeps the approved title', () => {
    expect(site.pages.home.title).toBe(site.title)
    expect(site.pages.home.path).toBe('/')
  })
})

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

describe('headTags for a page other than home', () => {
  test('points the canonical link, og:url and share image at that page', () => {
    const tags = headTags('https://example.com', '/work/healthcare/')
    expect(tags).toContain('rel="canonical" href="https://example.com/work/healthcare/"')
    expect(tags).toContain('property="og:url" content="https://example.com/work/healthcare/"')
    expect(tags).toContain('property="og:image" content="https://example.com/og-healthcare.png"')
    expect(tags).toContain('name="twitter:image" content="https://example.com/og-healthcare.png"')
  })

  test('the home page keeps its own share image', () => {
    expect(headTags('https://example.com', '/')).toContain('property="og:image" content="https://example.com/og-image.png"')
  })

  test('every page names a share image that exists and is 1200x630', () => {
    for (const p of Object.values(site.pages)) {
      const file = new URL(`../public${p.image}`, import.meta.url)
      expect(existsSync(file), `${p.image} is missing from public/`).toBe(true)
      const png = readFileSync(file)
      expect(png.readUInt32BE(16)).toBe(1200)
      expect(png.readUInt32BE(20)).toBe(630)
    }
  })
})

describe('buildSitemap', () => {
  test('is null when no site URL is set', () => {
    expect(buildSitemap(undefined)).toBeNull()
  })

  test('lists every page exactly once', () => {
    const xml = buildSitemap('https://example.com/')
    expect(xml).not.toBeNull()
    expect(xml!.match(/<loc>/g)).toHaveLength(Object.keys(site.pages).length)
    expect(xml).toContain('<loc>https://example.com/</loc>')
    expect(xml).toContain('<loc>https://example.com/work/healthcare/</loc>')
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

describe('per-page metadata', () => {
  test('metaTags uses the page title and description, and marks the case study as an article', () => {
    const home = metaTags('home')
    const study = metaTags('healthcare')
    expect(home).toContain('property="og:type" content="website"')
    expect(study).toContain('property="og:type" content="article"')
    expect(study).toContain(`name="description" content="${site.pages.healthcare.description}"`)
    expect(study).toContain(`property="og:title" content="${site.pages.healthcare.title}"`)
  })

  test('the case study structured data is an Article by the same person, with no ratings or dates', () => {
    const study = JSON.parse(buildJsonLd('healthcare'))
    expect(study['@type']).toBe('Article')
    expect(study.headline).toBe(site.pages.healthcare.title)
    expect(study.url).toBe(`${site.url}${site.pages.healthcare.path}`)
    expect(study.author.name).toBe(site.name)
    expect(study.author.sameAs).toEqual(expect.arrayContaining([site.github, site.linkedin]))
    expect(JSON.stringify(study)).not.toMatch(/rating|review|datePublished|dateModified/i)
    expect(buildJsonLd('healthcare')).not.toContain('<')
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

describe('html entry files', () => {
  test.each([
    ['home', '../index.html'],
    ['healthcare', '../work/healthcare/index.html'],
  ] as const)('the %s page <title> equals its page title, and it has every SEO placeholder', (key, file) => {
    const html = readFileSync(new URL(file, import.meta.url), 'utf8')
    expect(html).toContain(`<title>${site.pages[key].title}</title>`)
    for (const marker of ['<!--seo-meta-->', '<!--seo-head-->', '<!--json-ld-->', '<!--noscript-->']) {
      expect(html).toContain(marker)
    }
  })
})
