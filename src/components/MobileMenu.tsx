'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useCallback } from 'react'
import useBodyLock from '@/hooks/useBodyLock'

type Item = { href: string; label: string }

export default function MobileMenu({
  open, onClose, items, title = 'Menu',
}: { open: boolean; onClose: () => void; items: Item[]; title?: string }) {
  useBodyLock(open)
  const router = useRouter()
  const pathname = usePathname()
  const firstRef = useRef<HTMLAnchorElement>(null)
  const isClosingRef = useRef(false)

  // ESC to close - only when open
  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isClosingRef.current) {
        isClosingRef.current = true
        onClose()
        setTimeout(() => {
          isClosingRef.current = false
        }, 350)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  // Focus first link when menu opens
  useEffect(() => {
    if (open && firstRef.current) {
      // Small delay to ensure menu is visible
      const timer = setTimeout(() => {
        firstRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [open])

  // Close on route change - but never auto-open
  const prevPathnameRef = useRef(pathname)
  useEffect(() => {
    if (open && prevPathnameRef.current !== pathname) {
      // Pathname actually changed, close menu
      if (!isClosingRef.current) {
        isClosingRef.current = true
        onClose()
        setTimeout(() => {
          isClosingRef.current = false
        }, 350)
      }
      prevPathnameRef.current = pathname
    } else if (!open) {
      // Update ref when menu is closed
      prevPathnameRef.current = pathname
    }
  }, [pathname, open, onClose])

  // Dynamic header offset
  const headerOffset = useMemo(() => {
    if (typeof window === 'undefined') return 80
    const el = document.querySelector<HTMLElement>('header')
    const cssVar = getComputedStyle(document.documentElement).getPropertyValue('--header-height')
    const varVal = parseInt(cssVar || '0', 10)
    if (varVal) return varVal
    if (el) return el.getBoundingClientRect().height || 80
    return 80
  }, [])

  const smoothScrollTo = useCallback((hash: string) => {
    if (typeof window === 'undefined') return
    const id = hash.replace('#', '')
    const target = document.getElementById(id)
    if (!target) return
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 8
    window.scrollTo({ top, behavior: 'smooth' })
    if (typeof history !== 'undefined') {
      history.replaceState(null, '', `#${id}`)
    }
  }, [headerOffset])

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return
    isClosingRef.current = true
    onClose()
    setTimeout(() => {
      isClosingRef.current = false
    }, 350)
  }, [onClose])

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Guard against rapid clicks during animation
    if (isClosingRef.current) {
      e.preventDefault()
      return
    }

    const samePageHash = href.startsWith('#') || (href.startsWith(`${pathname}#`))

    // Close menu first
    handleClose()

    if (samePageHash) {
      e.preventDefault()
      const hash = href.startsWith('#') ? href : href.slice(href.indexOf('#'))
      // Wait for exit animation to complete before scrolling
      setTimeout(() => {
        smoothScrollTo(hash)
      }, 350)
      return
    }

    if (href.startsWith('/')) {
      e.preventDefault()
      // Navigate after menu closes
      setTimeout(() => {
        router.push(href)
      }, 350)
    }
    // External links: allow default behavior
  }, [pathname, handleClose, smoothScrollTo, router])

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          key="mobile-menu-overlay"
          className="fixed z-[120]"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 120,
            overflow: 'hidden',
          }}
          role="dialog"
          aria-modal="true"
          initial={false}
        >
          {/* Backdrop - only fades, never slides */}
          <motion.button
            aria-label="Close"
            onClick={handleClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm cursor-default"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Full-screen panel - slides from right */}
          <motion.nav
            key="mobile-menu-panel"
            className="absolute bg-white flex flex-col"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              overflow: 'hidden',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'tween',
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 flex-shrink-0" style={{ minHeight: '56px' }}>
              <span className="text-base font-bold text-neutral-900">{title}</span>
              <button
                onClick={handleClose}
                className="p-2 text-neutral-900 hover:opacity-70 transition-opacity"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu items - static, no animation */}
            <div 
              className="flex-1 overflow-y-auto px-4 py-6"
              style={{
                flex: '1 1 auto',
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <ul className="space-y-6" style={{ width: '100%', listStyle: 'none', margin: 0, padding: 0 }}>
                {items && items.length > 0 ? (
                  items.map((it, i) => (
                    <li key={it.href} style={{ width: '100%' }}>
                      <Link
                        href={it.href}
                        ref={i === 0 ? firstRef : undefined}
                        onClick={(e) => handleClick(e, it.href)}
                        className="block text-base font-bold text-neutral-900 hover:opacity-70 transition-opacity"
                        style={{ display: 'block', width: '100%' }}
                      >
                        {it.label}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">No menu items available</li>
                )}
              </ul>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
