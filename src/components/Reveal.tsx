'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  animation?: 'fade-up' | 'slide-left' | 'slide-right' | 'scale-up' | 'blur-up'
  delay?: number
  once?: boolean
  threshold?: number
  className?: string
}

export default function Reveal({
  children,
  animation = 'fade-up',
  delay = 0,
  once = true,
  threshold = 0.1,
  className = '',
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => {
                setIsVisible(true)
                if (once) setHasAnimated(true)
              }, delay)
            } else {
              setIsVisible(true)
              if (once) setHasAnimated(true)
            }
          } else if (!once && !hasAnimated) {
            setIsVisible(false)
          }
        })
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [delay, once, threshold, hasAnimated])

  return (
    <div
      ref={ref}
      className={`reveal reveal-${animation} ${isVisible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  )
}


