'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Team from '@/components/Team'

// Lazy load heavy components for better initial load performance
const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  loading: () => <div className="py-20 bg-white" aria-label="Loading testimonials" />,
})
const Services = dynamic(() => import('@/components/Services'), {
  loading: () => <div className="py-20 bg-white" aria-label="Loading services" />,
})
const Contact = dynamic(() => import('@/components/Contact'), {
  loading: () => <div className="py-20 bg-white" aria-label="Loading contact form" />,
})
const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="bg-gray-900 text-white py-12" aria-label="Loading footer" />,
})

export default function Home() {
  // Ensure scroll is enabled on page load
  useEffect(() => {
    if (typeof window === 'undefined') return

    const enableScroll = () => {
      // Check if any modal or menu is open
      const hasModal = document.querySelector('[role="dialog"][aria-modal="true"]')
      const bodyOverflow = window.getComputedStyle(document.body).overflow
      const bodyOverflowY = window.getComputedStyle(document.body).overflowY
      
      // Only enable scroll if no modal is open and body is currently locked
      if (!hasModal && (bodyOverflow === 'hidden' || bodyOverflowY === 'hidden')) {
        // Check if it's actually locked by checking inline styles
        const inlineOverflow = document.body.style.overflow
        const inlineOverflowY = document.body.style.overflowY
        
        // Only enable if it's locked via inline styles (not CSS)
        if (inlineOverflow === 'hidden' || inlineOverflowY === 'hidden') {
          document.body.style.removeProperty('overflow')
          document.body.style.removeProperty('overflow-y')
          document.body.style.removeProperty('padding-right')
        }
      }
      
      // Ensure html allows horizontal scrolling to be hidden
      document.documentElement.style.setProperty('overflow-x', 'hidden', 'important')
      
      // Only remove html overflow-y if no modal is open
      if (!hasModal) {
        const htmlOverflowY = document.documentElement.style.overflowY
        if (htmlOverflowY === 'hidden') {
          document.documentElement.style.removeProperty('overflow-y')
        }
      }
    }
    
    // Enable immediately
    enableScroll()
    
    // Enable on next frame to catch any late-applying styles
    requestAnimationFrame(enableScroll)
    
    // Also enable after a short delay
    const timeout = setTimeout(enableScroll, 100)
    
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'Waylott',
            description: 'Revenue growth consulting for $500K-$10M businesses',
            url: 'https://waylott.com',
            logo: 'https://waylott.com/logo.png',
            areaServed: 'Worldwide',
            serviceType: 'Business Consulting',
            offers: {
              '@type': 'Offer',
              name: 'Anchor Revenue Review Blueprint',
              description: 'Uncover hidden revenue in your business',
            },
          }),
        }}
      />
      <div className="min-h-screen bg-white overflow-x-hidden w-full max-w-full">
        <Header />
        <Hero />
        <About />
        <Team />
        <Testimonials />
        <Services />
        <Contact />
        <Footer />
      </div>
    </>
  )
}