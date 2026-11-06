import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import HeroSection from './components/HeroSection.jsx'
import AboutSection from './components/AboutSection.jsx'
import TransformationsSection from './components/TransformationsSection.jsx'
import ReviewsSection from './components/ReviewsSection.jsx'
import ProofSection from './components/ProofSection.jsx'
import EnquirySection from './components/EnquirySection.jsx'
import PlansPage from './components/PlansPage.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import WhatsAppButton from './components/WhatsAppButton.jsx'
import AdminEnquiryModal from './components/AdminEnquiryModal.jsx'

function getInitialPage() {
  if (typeof window === 'undefined') return 'home'
  const path = window.location.pathname.toLowerCase()
  const hash = window.location.hash.toLowerCase()
  if (path === '/plans' || path.startsWith('/plans') || hash === '#plans') {
    return 'plans'
  }
  return 'home'
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(getInitialPage)
  const [isAdminOpen, setIsAdminOpen] = useState(false)



  // Sync with browser back/forward buttons and optional private admin shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage())
    }
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        setIsAdminOpen((prev) => !prev)
      }
    }
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const navigate = (page, targetHash = '') => {
    setCurrentPage(page)
    const newPath = page === 'plans' ? '/plans' : '/'
    try {
      window.history.pushState(null, '', newPath + (targetHash ? targetHash : ''))
    } catch {
      // In restricted or iframe environments
    }

    if (targetHash) {
      setTimeout(() => {
        const id = targetHash.replace('#', '')
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 80)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="page">
      <main className="canvas">
        <Navbar currentPage={currentPage} onNavigate={navigate} />

        {currentPage === 'home' ? (
          <>
            <HeroSection />
            {/* About us: Mitali Shah's story, straight after the hero */}
            <AboutSection />
            {/* "Real clients": the before/after wheel, after About */}
            <TransformationsSection />
            {/* WhatsApp reviews, a row you slide sideways, straight after Real clients */}
            <ReviewsSection />
            {/* "Why TheHealthyStitch". Evidence and published literature */}
            <ProofSection />
            {/* The enquiry form. The nav's "Enquiry form" and "Get Started" land here */}
            <EnquirySection />
          </>
        ) : (
          /* Dedicated Plans Page with Boxed UI */
          <PlansPage onNavigateHome={() => navigate('home')} />
        )}
      </main>

      {/* Outside <main>, so it is the page's contentinfo landmark. */}
      <SiteFooter onNavigate={navigate} currentPage={currentPage} />

      {/* Fixed to the bottom-right corner of every screen. */}
      <WhatsAppButton />

      {/* Admin Portal Modal */}
      <AdminEnquiryModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  )
}
