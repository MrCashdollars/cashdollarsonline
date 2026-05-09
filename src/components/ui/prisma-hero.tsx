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
    <section className="w-full py-20 sm:py-28">
      <div className="relative w-full min-h-[480px] sm:min-h-[560px] overflow-hidden rounded-2xl md:rounded-[2rem]">

        {/* ── Background: diagonal green/yellow split with $ pattern ── */}
        {/* Yellow base — fills right portion */}
        <div className="absolute inset-0" style={{ backgroundColor: '#FBC02D' }} />

        {/* Green left portion, clipped diagonally */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#1B5E20',
            clipPath: 'polygon(0 0, 58% 0, 40% 100%, 0 100%)',
          }}
        />

        {/* Repeating $ sign texture over entire background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Ctext x='8' y='36' font-family='serif' font-size='26' font-weight='bold' fill='%23000' fill-opacity='0.07'%3E%24%3C/text%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Hero content — shifted toward top */}
        <div className="absolute inset-0 flex items-start pt-10 sm:pt-14 px-4 sm:px-6 md:px-10">
          <div className="grid grid-cols-12 items-center gap-6 w-full">

            {/* Large tagline text — left column (on green) */}
            <div className="col-span-12 lg:col-span-7">
              <h1
                className="font-bold leading-[0.85] tracking-[-0.05em] text-[14vw] sm:text-[12vw] md:text-[11vw] lg:text-[9vw]"
                style={{ color: '#E1E0CC' }}
              >
                <WordsPullUp text="Cash Dollars" />
                <br />
                <WordsPullUp
                  text="Online"
                  style={{ color: '#FBC02D' }}
                />
              </h1>
            </div>

            {/* Value prop + CTAs — right column (on yellow, dark text for contrast) */}
            <div className="col-span-12 flex flex-col gap-5 lg:col-span-5">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm md:text-base font-medium"
                style={{ color: '#1B5E20', lineHeight: 1.5 }}
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
                  className="group inline-flex items-center gap-2 self-start rounded-full py-1 pl-5 pr-1 text-sm font-semibold transition-all hover:gap-3 sm:text-base no-underline"
                  style={{ backgroundColor: '#1B5E20', color: '#FBC02D' }}
                >
                  Get the Free Guide
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:scale-110 sm:h-10 sm:w-10"
                    style={{ backgroundColor: '#FBC02D' }}
                  >
                    <ArrowRight className="h-4 w-4" style={{ color: '#1B5E20' }} />
                  </span>
                </motion.a>

                <motion.a
                  href="https://youtube.com/@cashdollarsonline2195"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="self-start text-sm sm:text-base no-underline transition-colors font-semibold"
                  style={{ color: 'rgba(27, 94, 32, 0.75)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#1B5E20')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(27, 94, 32, 0.75)')}
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
                style={{ color: 'rgba(27, 94, 32, 0.5)' }}
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
