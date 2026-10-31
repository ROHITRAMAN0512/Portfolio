import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { site } from '../../content/site'
import { useActiveSection } from '../../hooks/useActiveSection'
import { Button } from '../ui/Button'

const navIds = site.nav.map((n) => n.id)

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const active = useActiveSection(navIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const linkColor = (id: string) => (active === id ? 'text-accent' : 'text-muted hover:text-text')

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        scrolled || menuOpen ? 'border-line bg-bg/95' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-4 sm:px-6">
        <a href="#top" className="inline-flex min-h-11 items-center font-display text-xl text-text">
          {site.name}
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {site.nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? 'true' : undefined}
              className={`inline-flex min-h-11 items-center rounded-md px-3 text-sm transition-colors ${linkColor(item.id)}`}
            >
              {item.label}
            </a>
          ))}
          <Button href="#contact" className="ml-3">
            Let&apos;s talk
          </Button>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex size-11 items-center justify-center rounded-lg text-text lg:hidden"
        >
          {menuOpen ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label="Primary mobile" className="border-t border-line bg-bg lg:hidden">
          <ul className="mx-auto flex max-w-[1120px] flex-col px-4 py-3 sm:px-6">
            {site.nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-11 items-center rounded-md text-base transition-colors ${linkColor(item.id)}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Button href="#contact" onClick={() => setMenuOpen(false)} className="w-full">
                Let&apos;s talk
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
