'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Team from '@/components/Team'

// Lazy load heavy components for better initial load performance
const Phases = dynamic(() => import('@/components/Phases'), {
  loading: () => <div className="py-20 bg-white" aria-label="Loading phases" />,
})
const SignatureService = dynamic(() => import('@/components/SignatureService'), {
  loading: () => <div className="py-20 bg-white" aria-label="Loading signature service" />,
})
const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  loading: () => <div className="py-20 bg-white" aria-label="Loading testimonials" />,
})
const Contact = dynamic(() => import('@/components/Contact'), {
  loading: () => <div className="py-20 bg-white" aria-label="Loading contact form" />,
})
const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="bg-gray-900 text-white py-12" aria-label="Loading footer" />,
})

export default function Home() {
  // Ensure native browser scrolling works
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Remove any inline styles that might interfere with native scrolling
    document.body.style.removeProperty('overflow')
    document.body.style.removeProperty('overflow-y')
    document.body.style.removeProperty('overflow-x')
    document.body.style.removeProperty('padding-right')
    document.documentElement.style.removeProperty('overflow')
    document.documentElement.style.removeProperty('overflow-y')
    document.documentElement.style.removeProperty('overflow-x')
    
    // Ensure native scrollbar is visible and functional
    document.documentElement.style.setProperty('overflow-y', 'scroll', 'important')
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
      <div className="min-h-screen bg-white w-full max-w-full">
        <Header />
        <Hero />
        <Phases />
        <Team />
        <Testimonials />
        <SignatureService />
        <Contact />
        <Footer />
      </div>
    </>
  )
}