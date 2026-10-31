import { site } from './content/site'
import { SkipLink } from './components/layout/SkipLink'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'

export default function App() {
  return (
    <div id="top">
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {/* Sections are mounted here as they are built (Tasks 6-9). */}
        {site.nav.map((item) => (
          <section key={item.id} id={item.id} aria-label={item.label} className="grid min-h-[60vh] place-items-center">
            <p className="font-mono text-sm text-muted">{item.label}</p>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  )
}
