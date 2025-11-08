'use client'

import { useState } from 'react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900">Waylott</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#about" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                About
              </a>
              <a href="#services" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Services
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Testimonials
              </a>
              <a href="#contact" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="https://app.waylott.com/widget/booking/dR4kyj64ZOULbqZ7TOx6"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-700 text-white px-5 py-2 rounded-full text-[18px] font-semibold hover:bg-emerald-800 transition-colors shadow-sm"
            >
              Book free consult
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
              <a href="#about" className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium">
                About
              </a>
              <a href="#services" className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium">
                Services
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium">
                Testimonials
              </a>
              <a href="#contact" className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium">
                Contact
              </a>
              <a
                href="https://app.waylott.com/widget/booking/dR4kyj64ZOULbqZ7TOx6"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 inline-flex items-center justify-center rounded-lg bg-[#1D573D] text-white px-4 py-2 text-[18px] font-semibold shadow-card transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D573D]/50"
              >
                Book free consult
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

