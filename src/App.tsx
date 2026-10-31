import { site } from './content/site'
import { SkipLink } from './components/layout/SkipLink'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './sections/Hero'
import { Work } from './sections/Work'
import { Services } from './sections/Services'
import { Expertise } from './sections/Expertise'
import { Process } from './sections/Process'
import { About } from './sections/About'
import { useScrollToHash } from './hooks/useScrollToHash'

export default function App() {
  useScrollToHash()
  return (
    <div id="top">
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Work />
        <Services />
        <Expertise />
        <Process />
        <About />
        {/* The contact section is mounted here when it is built (Task 9). */}
        {site.nav.filter((item) => item.id === 'contact').map((item) => (
          <section key={item.id} id={item.id} aria-label={item.label} className="grid min-h-[60vh] place-items-center">
            <p className="font-mono text-sm text-muted">{item.label}</p>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  )
}
