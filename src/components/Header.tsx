
'use client'

import { useEffect, useState } from 'react'
import MobileMenu from '@/components/MobileMenu'
import logo from '@/images/Waylott-logo.png'

const navItems = [
  { href: '#about', label: 'Approach' },
  { href: '#team', label: 'Team' },
  { href: '#services', label: 'Services' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  const [isReady, setIsReady] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  // Single source of truth for menu state
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 10)

    const checkScroll = () => {
      // Check if hero heading sentinel has reached or passed the header
      const sentinel = document.getElementById('hero-heading-sentinel')
      if (sentinel) {
        const rect = sentinel.getBoundingClientRect()
        // Header height is 80px (h-20 = 5rem = 80px)
        // Show background when sentinel reaches or passes the header bottom
        const headerHeight = 80
        setIsScrolled(rect.top <= headerHeight)
      } else {
        // Fallback to simple scroll check if sentinel not found
        setIsScrolled(window.scrollY > 100)
      }
    }

    // Small delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      checkScroll()
    }, 50)

    window.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll, { passive: true })

    return () => {
      clearTimeout(t)
      clearTimeout(initTimeout)
      window.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  // Close menu handler - single function
  const handleCloseMenu = () => {
    setMenuOpen(false)
  }

  const baseClasses = 'fixed top-0 left-0 right-0 z-[110] transition-all duration-300'
  const bgClasses = isScrolled 
    ? 'bg-white/95 backdrop-blur-md' 
    : 'bg-transparent'
  const borderClasses = isScrolled 
    ? 'border-b border-gray-100' 
    : ''
  const enterClasses = isReady ? 'opacity-100' : 'opacity-100'

  return (
    <header className={`${baseClasses} ${bgClasses} ${borderClasses} ${enterClasses}`}>
      <nav aria-label="Main navigation" className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between relative">
          {/* Left: Logo */}
          <a href="#" className="flex items-center gap-3 text-gray-900 font-semibold leading-none">
            <img src={typeof logo === 'string' ? logo : logo.src} alt="Waylott" className="block h-12 sm:h-16 md:h-[72px] w-auto" style={{ imageRendering: 'auto' }} />
          </a>

          {/* Center: Links (desktop) */}
          <div className="hidden lg:flex items-center gap-12 text-sm absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-[#000000] font-medium hover:text-gray-900">
                {item.label}
              </a>
            ))}
          </div>

          {/* Right: CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="https://app.waylott.com/widget/booking/dR4kyj64ZOULbqZ7TOx6"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center justify-center rounded-lg bg-[#1D573D] text-white px-4 h-10 text-sm font-medium shadow-card transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-hover ring-[#1D573D]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D573D]/50"
            >
              Schedule a Consultation
            </a>
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="inline-flex lg:hidden items-center justify-center w-10 h-10 rounded-md border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Single MobileMenu instance - only one in the tree */}
      <MobileMenu open={menuOpen} onClose={handleCloseMenu} items={navItems} />
    </header>
  )
}


