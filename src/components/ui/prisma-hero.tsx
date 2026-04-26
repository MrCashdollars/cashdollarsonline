// Adapted from 1.txt (Prisma Hero)
// Changes from original:
//   • Autoplay video REMOVED — replaced with brand gradient (CLAUDE.md §7: no autoplay video ever)
//   • Nav items updated to CDO routes
//   • Hero text updated to CDO tagline and value prop
//   • CTA buttons updated to CDO actions
//   • Colors adapted to brand green/yellow palette

import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'

/* ── WordsPullUp ─────────────────────────────────────────────────────── */
interface WordsPullUpProps {
  text: string
  className?: string
  showAsterisk?: boolean
  style?: React.CSSProperties
}

export const WordsPullUp = ({ text, className = '', showAsterisk = false, style }: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const words = text.split(' ')

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : '0.25em' }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        )
      })}
    </div>
  )
}

/* ── WordsPullUpMultiStyle ───────────────────────────────────────────── */
interface Segment {
  text: string
  className?: string
}
interface WordsPullUpMultiStyleProps {
  segments: Segment[]
  className?: string
  style?: React.CSSProperties
}

export const WordsPullUpMultiStyle = ({ segments, className = '', style }: WordsPullUpMultiStyleProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  const words: { word: string; className?: string }[] = []
  segments.forEach((seg) => {
    seg.text.split(' ').forEach((w) => {
      if (w) words.push({ word: w, className: seg.className })
    })
  })

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${w.className ?? ''}`}
          style={{ marginRight: '0.25em' }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  )
}

/* ── Hero ────────────────────────────────────────────────────────────── */
const PrismaHero = () => {
  return (
    // h-[calc(100vh-4rem)]: subtract the 64px (4rem) global sticky nav so the hero
    // fills exactly the visible viewport below it.
    <section className="w-full" style={{ height: 'calc(100vh - 4rem)' }}>
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">

        {/* Brand gradient background — replaces autoplay video (CLAUDE.md §7) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#1a2e1a]" />

        {/* Noise texture overlay */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.4] mix-blend-overlay" />

        {/* Vignette for text legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-2 sm:px-6 md:px-10">
          <div className="grid grid-cols-12 items-end gap-4">

            {/* Large tagline text */}
            <div className="col-span-12 lg:col-span-8">
              <h1
                className="font-bold leading-[0.85] tracking-[-0.05em] text-[14vw] sm:text-[12vw] md:text-[11vw] lg:text-[10vw]"
                style={{ color: '#E1E0CC' }}
              >
                <WordsPullUp text="Cash Dollars" />
                <br />
                <WordsPullUp
                  text="Online"
                  className="text-brand-yellow-700"
                  style={{ color: '#FBC02D' }}
                />
              </h1>
            </div>

            {/* Value prop + CTAs */}
            <div className="col-span-12 flex flex-col gap-5 pb-6 lg:col-span-4 lg:pb-10">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs sm:text-sm md:text-base"
                style={{ color: 'rgba(225, 224, 204, 0.85)', lineHeight: 1.4 }}
              >
                {/* [DRAFT — user to review] */}
                We don't sell dreams. We provide roadmaps. Practical, honest strategies for building
                $1K/month in supplemental income — with real timelines and no hype.
              </motion.p>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.a
                  href="/free-guides"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="group inline-flex items-center gap-2 self-start rounded-full py-1 pl-5 pr-1 text-sm font-semibold text-black transition-all hover:gap-3 sm:text-base no-underline"
                  style={{ backgroundColor: '#FBC02D' }}
                >
                  Get the Free Guide
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                    <ArrowRight className="h-4 w-4" style={{ color: '#FBC02D' }} />
                  </span>
                </motion.a>

                <motion.a
                  href="https://youtube.com/@cashdollarsonline2195"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="self-start text-sm sm:text-base no-underline transition-colors"
                  style={{ color: 'rgba(225, 224, 204, 0.7)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#E1E0CC')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(225, 224, 204, 0.7)')}
                >
                  Watch on YouTube →
                </motion.a>
              </div>

              {/* Income disclaimer — required per CLAUDE.md §8 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="text-[10px]"
                style={{ color: 'rgba(225, 224, 204, 0.45)' }}
              >
                * Results vary. Most people see their first $100 in 3–6 months with consistent effort.
              </motion.p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export { PrismaHero }
