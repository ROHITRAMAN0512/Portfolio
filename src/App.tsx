import { SkipLink } from './components/layout/SkipLink'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './sections/Hero'
import { Work } from './sections/Work'
import { Services } from './sections/Services'
import { Expertise } from './sections/Expertise'
import { Process } from './sections/Process'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
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
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
