import Navbar from './components/Navbar.jsx'
import HeroSection from './components/HeroSection.jsx'
import AboutSection from './components/AboutSection.jsx'
import TransformationsSection from './components/TransformationsSection.jsx'
import ReviewsSection from './components/ReviewsSection.jsx'
import ProofSection from './components/ProofSection.jsx'
import EnquirySection from './components/EnquirySection.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import WhatsAppButton from './components/WhatsAppButton.jsx'

export default function App() {
  return (
    <div className="page">
      <main className="canvas">
        <Navbar />
        <HeroSection />
        {/* About us: Mitali Shah's story, straight after the hero */}
        <AboutSection />
        {/* "Real clients": the before/after wheel, after About */}
        <TransformationsSection />
        {/* WhatsApp reviews, running sideways, straight after Real clients */}
        <ReviewsSection />
        {/* "Why Healthystitch". The nav's "Plans" lands here */}
        <ProofSection />
        {/* The enquiry form. The nav's "Enquiry form" and "Get Started" land here */}
        <EnquirySection />
      </main>

      {/* Outside <main>, so it is the page's contentinfo landmark. */}
      <SiteFooter />

      {/* Fixed to the bottom-right corner of every screen. */}
      <WhatsAppButton />
    </div>
  )
}
