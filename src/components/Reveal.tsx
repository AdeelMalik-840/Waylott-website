'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  animation?: 'fade-up' | 'slide-in-left' | 'slide-in-right'
  delay?: number
  once?: boolean
}

const animationVariants = {
  'fade-up': {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  'slide-in-left': {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  'slide-in-right': {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
} as const

export default function Reveal({
  children,
  animation = 'fade-up',
  delay = 0,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion()
  const variant = animationVariants[animation]

  return (
    <motion.div
      initial={reduce ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once, amount: 0.35 }}
      variants={variant}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: reduce ? 0 : delay / 1000,
      }}
    >
      {children}
    </motion.div>
  )
}
