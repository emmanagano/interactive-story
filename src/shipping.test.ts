import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// These check the things that make the shipped site what it should be: a page that shares well,
// and a game that talks to nobody except Google Fonts.
const root = fileURLToPath(new URL('..', import.meta.url))
const read = (path: string) => readFileSync(join(root, path), 'utf-8')
const indexHtml = read('index.html')
const netlifyToml = read('netlify.toml')

const metaContent = (selector: string): string | undefined =>
  indexHtml.match(new RegExp(`<meta\\s+${selector}\\s+content="([^"]*)"`, 's'))?.[1]

describe('the page head', () => {
  it('has a short title and a description that fits a search result', () => {
    const title = indexHtml.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
    expect(title.length).toBeGreaterThan(5)
    expect(title.length).toBeLessThanOrEqual(60)
    const description = metaContent('name="description"') ?? ''
    expect(description.length).toBeGreaterThanOrEqual(70)
    expect(description.length).toBeLessThanOrEqual(160)
  })

  it('sets the browser colour and a dark colour scheme', () => {
    expect(metaContent('name="theme-color"')).toBe('#050505')
    expect(metaContent('name="color-scheme"')).toBe('dark')
  })

  it('has the social-preview tags a shared link needs', () => {
    for (const property of ['og:type', 'og:title', 'og:description', 'og:image', 'og:image:alt', 'og:url']) {
      expect(metaContent(`property="${property}"`), property).toBeTruthy()
    }
    expect(metaContent('name="twitter:card"')).toBe('summary_large_image')
    expect(metaContent('name="twitter:image"')).toBeTruthy()
  })

  it('points the preview image at the build-time site address, so it is absolute once deployed', () => {
    expect(metaContent('property="og:image"')).toBe('__SITE_URL__/og-image.jpg')
    expect(metaContent('name="twitter:image"')).toBe('__SITE_URL__/og-image.jpg')
  })

  it('links icons and a preview image that exist, at a size social sites accept', () => {
    for (const file of ['favicon.svg', 'apple-touch-icon.png', 'og-image.jpg']) {
      expect(existsSync(join(root, 'public', file)), file).toBe(true)
    }
    expect(statSync(join(root, 'public/og-image.jpg')).size).toBeLessThan(300_000)
  })

  it('tells a visitor without JavaScript why nothing shows', () => {
    expect(indexHtml).toContain('<noscript>')
  })
})

describe('the security headers', () => {
  const policy = netlifyToml.match(/Content-Security-Policy = "([^"]*)"/)?.[1] ?? ''
  const directive = (name: string) => policy.split(';').map((part) => part.trim()).find((part) => part.startsWith(name + ' '))

  it('keeps scripts to this site: no inline scripts and no eval', () => {
    expect(directive('script-src')).toBe("script-src 'self'")
    expect(policy).not.toContain('unsafe-inline')
    expect(policy).not.toContain('unsafe-eval')
  })

  it('lets only Google Fonts through from outside, and nothing else may be fetched', () => {
    const hosts = [...policy.matchAll(/https?:\/\/[^\s;]+/g)].map((match) => match[0])
    expect(hosts.sort()).toEqual(['https://fonts.googleapis.com', 'https://fonts.gstatic.com'])
    expect(directive('connect-src')).toBe("connect-src 'self'")
    expect(directive('default-src')).toBe("default-src 'self'")
  })

  it('stops the page being framed and blocks plugins', () => {
    expect(directive('frame-ancestors')).toBe("frame-ancestors 'none'")
    expect(directive('object-src')).toBe("object-src 'none'")
  })

  it('caches the hashed files for a year and sends the other safety headers', () => {
    expect(netlifyToml).toMatch(/for = "\/assets\/\*"[\s\S]*immutable/)
    for (const header of ['X-Content-Type-Options = "nosniff"', 'Referrer-Policy', 'Permissions-Policy']) {
      expect(netlifyToml).toContain(header)
    }
  })
})

describe('privacy: no requests to anyone but Google Fonts', () => {
  it('links to the portfolio in a new tab without leaking the opener', () => {
    const title = readFileSync(join(root, 'src/components/TitleScreen.tsx'), 'utf-8')
    expect(title).toContain('rel="noopener noreferrer"')
    expect(title).toContain("PORTFOLIO_URL = 'https://emmanagano.com/'")
  })

  const sourceFiles = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) return sourceFiles(full)
      return /\.(tsx?|css|html)$/.test(name) && !/\.test\./.test(name) ? [full] : []
    })

  it('finds no other web address in the page or the code', () => {
    const allowed = ['fonts.googleapis.com', 'fonts.gstatic.com', 'www.w3.org', 'emmanagano.com'] // www.w3.org is an XML namespace, not a request; emmanagano.com is Emma's own portfolio, linked from the title screen and only visited if the player clicks it
    const found = new Set<string>()
    for (const file of [join(root, 'index.html'), ...sourceFiles(join(root, 'src'))]) {
      for (const match of readFileSync(file, 'utf-8').matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) found.add(match[1])
    }
    expect([...found].filter((host) => !allowed.includes(host))).toEqual([])
  })
})
