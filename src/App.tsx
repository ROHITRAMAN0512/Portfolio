import { site } from './content/site'
import { SkipLink } from './components/layout/SkipLink'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './sections/Hero'
import { Work } from './sections/Work'

export default function App() {
  return (
    <div id="top">
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Work />
        {/* Remaining sections are mounted here as they are built (Tasks 8-9). */}
        {site.nav.filter((item) => item.id !== 'work').map((item) => (
          <section key={item.id} id={item.id} aria-label={item.label} className="grid min-h-[60vh] place-items-center">
            <p className="font-mono text-sm text-muted">{item.label}</p>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  )
}
