'use client'

import React from 'react'
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Target, ChartLine, Rocket } from 'lucide-react'
import Reveal from './Reveal'

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
}

function ParallaxPhaseCard({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-40, 40], [6, -6]), {
    stiffness: 120,
    damping: 12,
  })
  const ry = useSpring(useTransform(x, [-40, 40], [-6, 6]), {
    stiffness: 120,
    damping: 12,
  })

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - (r.left + r.width / 2))
    y.set(e.clientY - (r.top + r.height / 2))
  }

  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? {} : { rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
      transition={{ type: 'spring', stiffness: 140, damping: 16 }}
      className="will-change-transform flex flex-col h-full"
      variants={fadeUp}
      whileHover={{ y: -4 }}
    >
      {children}
    </motion.div>
  )
}

function PhaseCard({
  step,
  title,
  desc,
  tint,
  borderHex,
  icon,
  optional = false,
}: {
  step: string
  title: React.ReactNode
  desc: string
  tint: string
  borderHex: string
  icon: React.ReactNode
  optional?: boolean
}) {
  return (
    <div className="relative flex flex-col items-center h-full w-full">
      {/* Floating Step Pill */}
      <motion.div
        className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-[120px]"
        initial={{ opacity: 0, y: -6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: easeOut }}
      >
        <motion.div
          className="rounded-full border bg-white text-[#0A1628] text-center font-medium text-base sm:text-lg md:text-[18px] leading-tight flex items-center justify-center shadow-sm"
          style={{ borderColor: borderHex, height: '48px' }}
          animate={{ y: [0, -2, 0], boxShadow: ['0 1px 2px rgba(0,0,0,.06)', '0 6px 14px rgba(0,0,0,.10)', '0 1px 2px rgba(0,0,0,.06)'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {step}
        </motion.div>
      </motion.div>

      {/* Card */}
      <motion.article
        className={`
          w-full max-w-[280px] sm:max-w-[300px] md:max-w-[340px] mx-auto flex-1 rounded-[20px] ${tint}
          shadow-[0px_8px_20px_rgba(0,0,0,0.20)]
          p-4 sm:p-5 md:p-6 flex flex-col items-center text-center will-change-transform
        `}
        style={{ border: `1px solid ${borderHex}`, minHeight: '320px' }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: easeOut }}
        whileHover={{
          boxShadow: '0 16px 36px -8px rgba(0,0,0,.22), 0 4px 10px rgba(0,0,0,.08)',
        }}
      >
        {/* Icon */}
        <motion.div
          className="mb-5 mt-6 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center"
          whileHover={{ rotate: [0, -8, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center" aria-hidden="true">
            {icon}
          </div>
        </motion.div>

        {optional && (
          <span className="mb-1 inline-flex items-center rounded-full bg-white/90 px-3 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200" role="status" aria-label="Optional service">
            Optional
          </span>
        )}

        <h3 className="text-xl sm:text-2xl md:text-[24px] font-bold text-[#000000] leading-snug">
          {title}
        </h3>
        <p className="mt-3 text-base sm:text-lg md:text-[18px] leading-6 text-slate-600 flex-1">{desc}</p>
      </motion.article>
    </div>
  )
}

function DoubleChevron() {
  return (
    <div className="shrink-0 flex items-center justify-center my-2 md:my-0 hidden md:flex">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#1D573D]"
        aria-hidden="true"
      >
        <path d="m6 17 5-5-5-5" />
        <path d="m13 17 5-5-5-5" />
      </svg>
    </div>
  )
}

export default function Phases() {
  return (
    <section id="phases" className="relative overflow-hidden py-14 md:py-20">
      {/* Warm paper background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,#FFF6E6_12%,#FBF9F3_55%,#FFFFFF_85%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_10%,rgba(0,0,0,0.06),transparent_60%)] [mask-image:radial-gradient(90%_80%_at_50%_18%,black,transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <Reveal animation="fade-up">
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1628]">
              How We Work With You
            </h2>
            <p className="mt-2 text-slate-600 max-w-3xl mx-auto">
              A focused, high-impact journey from clarity to execution to
              mastery—each stage designed to build momentum and measurable
              growth.
            </p>
          </div>
        </Reveal>

        {/* Phases Row (staggered) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="flex flex-col md:flex-row items-stretch justify-center gap-6 px-2 sm:px-0"
        >
            <ParallaxPhaseCard>
              <PhaseCard
                step="Step 1"
                title={
                  <>
                    Two Anchor <br /> Assessment
                  </>
                }
                desc="We start by diagnosing what's really happening in your business — clarity before action."
                tint="bg-[#E7EFEA]"
                borderHex="#1D573D"
                icon={
                  <Target
                    className="w-8 h-8 sm:w-10 sm:h-10 text-[#1D573D]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                }
              />
            </ParallaxPhaseCard>

            <DoubleChevron />

            <ParallaxPhaseCard>
              <PhaseCard
                step="Step 2"
                title={
                  <>
                    Custom <br /> Strategy Plan
                  </>
                }
                desc="Together we build a tailored plan that fits your goals, team, and growth pace."
                tint="bg-[#FAF3E3]"
                borderHex="#DAA518"
                icon={
                  <ChartLine
                    className="w-8 h-8 sm:w-10 sm:h-10 text-[#CFAE57]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                }
              />
            </ParallaxPhaseCard>

            <DoubleChevron />

            <ParallaxPhaseCard>
              <PhaseCard
                step="Step 3"
                title={
                  <>
                    Implementation <br /> Support
                  </>
                }
                desc="If you want help executing, we'll guide you step-by-step to real results."
                tint="bg-[#EDE3DC]"
                borderHex="#CB9D76"
                icon={
                  <Rocket
                    className="w-8 h-8 sm:w-10 sm:h-10 text-[#C7A07D]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                }
                optional
              />
            </ParallaxPhaseCard>
          </motion.div>

        {/* CTA */}
        <Reveal animation="fade-up" delay={180}>
          <div className="text-center mt-12">
            <a
              href="https://app.waylott.com/widget/booking/dR4kyj64ZOULbqZ7TOx6"
              target="_blank"
              rel="noopener noreferrer"
              className="
              inline-flex items-center justify-center rounded-xl h-[60px]
              bg-[#1D573D] text-white px-6 text-[18px] font-semibold
              shadow-[0_12px_28px_rgba(29,87,61,0.22)]
              transition-transform duration-150 hover:-translate-y-0.5 focus:outline-none
              focus-visible:ring-2 focus-visible:ring-[#1D573D]/40
            "
            >
              Schedule a Consultation
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

