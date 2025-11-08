'use client';

import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Telescope, ShieldCheck, Sprout } from 'lucide-react';
import Image from 'next/image';
import greenBlob from '@/images/green-blob.svg';

/* ---------- Easing + variants (moved to top for hoisting) ---------- */
const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden py-16">
      {/* existing soft radial */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[140px] h-[560px] -z-[2]"
        style={{
          background:
            'radial-gradient(55% 75% at 50% 0%, rgba(22,101,52,0.14) 0%, rgba(22,101,52,0.08) 34%, rgba(22,101,52,0.00) 70%)',
        }}
      />

      {/* floating green-blob image (animated, reduced-motion safe) */}
      <AnimatedBlob />

      <div className="mx-auto max-w-[1120px] px-6 relative z-10">
        {/* Title */}
               <motion.h2
                 initial="hidden"
                 whileInView="show"
                 viewport={{ once: true, amount: 0.6 }}
                 variants={fadeUp}
                 className="text-center text-3xl sm:text-4xl font-extrabold text-[#000000] mb-4 relative z-0"
               >
                 Waylott&apos;s Signature Service
               </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05, ease: easeOut }}
          className="mx-auto mt-4 max-w-3xl text-center text-lg leading-7 text-gray-600 relative z-0"
        >
          Get tailored consulting packages that help you uncover hidden revenue, fix leaks, and
          scale sustainably—no matter where your business stands today.
        </motion.p>

        {/* How it Works pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1, ease: easeOut }}
          className="mt-6 flex justify-center relative z-0"
        >
          <div className="inline-flex items-center rounded-2xl border border-black/10 bg-gray-100 px-4 py-2 text-sm text-gray-800 shadow-sm">
            How It Works
          </div>
        </motion.div>

         {/* Cards (staggered) */}
         <motion.div
           initial="hidden"
           whileInView="show"
           viewport={{ once: true, amount: 0.3 }}
           variants={{
             hidden: {},
             show: { transition: { staggerChildren: 0.08 } },
           }}
           className="mt-[30px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 relative z-0 px-2 sm:px-0"
         >
           {/* Green blob behind cards */}
           <div
             aria-hidden
             className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center"
             style={{ top: '-40px', bottom: '-40px' }}
           >
             <div className="relative w-full max-w-6xl h-full" style={{ minHeight: '600px' }}>
               <Image
                 src={greenBlob}
                 alt=""
                 fill
                 className="object-contain opacity-65 mix-blend-multiply"
                 style={{ 
                   objectPosition: 'center',
                   filter: 'blur(25px) saturate(1.6)',
                 }}
                 loading="lazy"
                 quality={75}
               />
             </div>
           </div>
          <ParallaxCard>
            <StepCard
              step="Step 1"
              Icon={Telescope}
              title="One Hour $597 Anchor Revenue Review"
              body="Identify the 2 biggest anchors holding your business back"
            />
          </ParallaxCard>

          <ParallaxCard>
            <StepCard
              step="Step 2"
              Icon={ShieldCheck}
              title="The $30,000 Guarantee"
              quote={'"If we don\'t find you $30,000 in Hidden Revenue we refund you immediately"'}
            />
          </ParallaxCard>

          <ParallaxCard>
            <StepCard
              step="Step 3"
              Icon={Sprout}
              title="Custom Growth Package"
              optional
              body="Then we will work with you to capture that $30k in 90 days or we refund every dollar"
            />
          </ParallaxCard>
        </motion.div>

        {/* blue note */}
        <p className="mt-8 text-center text-sm font-semibold italic" style={{ color: '#000' }}>
          *each package is custom priced*
        </p>

        {/* CTA (kept, with gentle pulse) */}
        <div className="mt-6 flex justify-center">
          <AttentionCTA href="https://app.waylott.com/widget/booking/dR4kyj64ZOULbqZ7TOx6">
            Schedule Free 10 min Consult
          </AttentionCTA>
        </div>
      </div>
    </section>
  );
}

/* ---------- Animated blob using your SVG (float + fade, multiply blend) ---------- */
function AnimatedBlob() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center"
      style={{ top: '-50px', bottom: '-100px' }}
      animate={
        reduce
          ? undefined
          : { scale: [1, 1.03, 1], y: [0, 12, 0], opacity: [0.55, 0.5, 0.55] }
      }
      transition={reduce ? undefined : { duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="relative w-full max-w-5xl h-full" style={{ minHeight: '600px' }}>
        <Image
          src={greenBlob}
          alt=""
          fill
          className="object-contain opacity-50 mix-blend-multiply"
          style={{ objectPosition: 'center', filter: 'blur(30px) saturate(1.3)' }}
          loading="lazy"
          quality={75}
        />
      </div>
    </motion.div>
  );
}

/* ---------- Parallax/Tilt wrapper (subtle Apple/Stripe feel) ---------- */
function ParallaxCard({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-40, 40], [6, -6]), { stiffness: 120, damping: 12 });
  const ry = useSpring(useTransform(x, [-40, 40], [-6, 6]), { stiffness: 120, damping: 12 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - (r.left + r.width / 2));
    y.set(e.clientY - (r.top + r.height / 2));
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? {} : { rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
      transition={{ type: 'spring', stiffness: 140, damping: 16 }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}

/* ---------- CTA with periodic attention pulse (reduced-motion safe) ---------- */
function AttentionCTA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-[16px] font-semibold text-white shadow-[0_10px_20px_rgba(29,87,61,0.18)] transition-all duration-200 hover:bg-[#164a3a] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D573D]/50"
      style={{ backgroundColor: '#1D573D', minWidth: 280 }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#164a3a')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1D573D')}
      animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
      transition={reduce ? undefined : { duration: 1.2, repeat: Infinity, repeatDelay: 8, ease: 'easeInOut' }}
    >
      {children}
    </motion.a>
  );
}

/* ---------- Your original StepCard, upgraded with stagger + hover lift ---------- */
function StepCard({
  step,
  Icon,
  title,
  body,
  quote,
  optional = false,
}: {
  step: string;
  Icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  title: string;
  body?: string;
  quote?: string;
  optional?: boolean;
}) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      className="rounded-[24px] border border-black/10 bg-white p-5 sm:p-6 shadow-[0_6px_24px_-8px_rgba(0,0,0,.12),_0_2px_6px_rgba(0,0,0,.06)] hover:shadow-[0_14px_34px_-10px_rgba(0,0,0,.20)] transition-shadow md:h-full min-h-0 md:min-h-[320px] will-change-transform w-full"
    >
      {/* step row */}
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[32px] leading-none font-bold text-emerald-800">{step}</p>
        <motion.span
          className="text-[#C7A100]"
          whileHover={{ rotate: [0, -8, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <Icon size={48} strokeWidth={1.2} />
        </motion.span>
      </div>

      {/* title */}
      <h4 className="mt-6 text-[20px] font-medium text-[#0D1720]">{title}</h4>

      {/* optional pill */}
      {optional && (
        <span className="mt-3 inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-800">
          Optional
        </span>
      )}

      {/* body/quote */}
      {body && <p className="mt-3 text-[15.5px] leading-7 text-gray-600">{body}</p>}
      {quote && <p className="mt-3 text-[15.5px] leading-7 text-gray-600 italic">{quote}</p>}
    </motion.article>
  );
}
