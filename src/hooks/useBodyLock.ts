'use client'

import { useEffect, useRef } from 'react'

export default function useBodyLock(locked: boolean) {
  const scrollbarWidthRef = useRef<number>(0)
  const isLockedRef = useRef<boolean>(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    isLockedRef.current = locked

    if (locked) {
      // Calculate scrollbar width before hiding it
      scrollbarWidthRef.current = window.innerWidth - document.documentElement.clientWidth
      
      // prevent layout shift when scrollbar disappears
      if (scrollbarWidthRef.current > 0) {
        document.body.style.paddingRight = `${scrollbarWidthRef.current}px`
      }
      
      // Lock scrolling on both html and body
      document.body.style.overflow = 'hidden'
      document.body.style.overflowY = 'hidden'
      document.documentElement.style.overflowY = 'hidden'
    } else {
      // Always restore to scrollable state when unlocked
      document.body.style.removeProperty('overflow')
      document.body.style.removeProperty('overflow-y')
      document.body.style.removeProperty('padding-right')
      document.documentElement.style.setProperty('overflow-x', 'hidden', 'important')
      document.documentElement.style.removeProperty('overflow-y')
    }

    return () => {
      // Cleanup: only restore if we're actually unlocked
      if (typeof window !== 'undefined' && !isLockedRef.current) {
        document.body.style.removeProperty('overflow')
        document.body.style.removeProperty('overflow-y')
        document.body.style.removeProperty('padding-right')
        document.documentElement.style.setProperty('overflow-x', 'hidden', 'important')
        document.documentElement.style.removeProperty('overflow-y')
      }
    }
  }, [locked])
}


