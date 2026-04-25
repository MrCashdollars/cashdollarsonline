// Adapted from 3.txt (sticky-scroll-cards-section.tsx)
// Changes from original:
//   • Feature data updated to CDO's three income streams
//   • Header copy updated to CDO brand voice
//   • TypeScript types fixed for useScrollAnimation hook
//   • Unsplash images selected for each income stream

import React, { useState, useEffect, useRef } from 'react'

const features = [
  {
    title: 'Affiliate Marketing',
    description:
      'Recommend products and tools you actually use. When someone buys through your link, you earn a commission. No inventory, no customer service. Takes 3–6 months to see consistent income — but it compounds.',
    imageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    textColor: 'text-gray-700',
  },
  {
    title: 'Digital Products',
    description:
      'Create an ebook, template, or mini-course once — then sell it as many times as you want. The work is upfront; the sales can continue for years. Best for people with a specific skill or knowledge to share.',
    imageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
    bgColor: 'bg-amber-100 dark:bg-amber-900',
    textColor: 'text-gray-700',
  },
  {
    title: 'Content Monetization',
    description:
      'Build an audience on YouTube, a blog, or a newsletter — then monetize through ads, sponsorships, or affiliate links. Takes the most time to ramp up (6–12 months minimum) but creates the most durable long-term income.',
    imageUrl:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2074&auto=format&fit=crop',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    textColor: 'text-gray-700',
  },
]

/* ── Scroll animation hook ─────────────────────────────────────────── */
const useScrollAnimation = (): [React.RefObject<HTMLDivElement | null>, boolean] => {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root: null, rootMargin: '0px', threshold: 0.1 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, inView]
}

/* ── Animated section header ───────────────────────────────────────── */
const AnimatedHeader = () => {
  const [headerRef, headerInView] = useScrollAnimation()
  const [pRef, pInView] = useScrollAnimation()

  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2
        ref={headerRef}
        className={`text-4xl md:text-5xl font-bold transition-all duration-700 ease-out text-gray-900 ${
          headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* [DRAFT — user to review] */}
        Three Paths to Supplemental Income
      </h2>
      <p
        ref={pRef}
        className={`text-lg text-gray-600 mt-4 transition-all duration-700 ease-out delay-200 ${
          pInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* [DRAFT — user to review] */}
        Each path works. Each requires a different mix of time, money, and skills. Here's an honest
        breakdown of what each one looks like in practice.
      </p>
    </div>
  )
}

/* ── Main export ───────────────────────────────────────────────────── */
export function StickyFeatureSection() {
  return (
    <div className="bg-gray-50 font-sans">
      <div className="px-[5%]">
        <div className="max-w-7xl mx-auto">
          <section className="py-24 md:py-40 flex flex-col items-center">
            <AnimatedHeader />

            <div className="w-full">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`${feature.bgColor} grid grid-cols-1 md:grid-cols-2 items-center gap-4 md:gap-8 p-8 md:p-12 rounded-3xl mb-16 sticky`}
                  style={{ top: '120px' }}
                >
                  <div className="flex flex-col justify-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className={feature.textColor + ' leading-relaxed'}>{feature.description}</p>
                    <a
                      href={`/videos#${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="mt-6 inline-flex items-center gap-2 text-brand-green-800 font-semibold text-sm no-underline hover:underline"
                    >
                      Watch the tutorials →
                    </a>
                  </div>

                  <div className="mt-8 md:mt-0">
                    <img
                      src={feature.imageUrl}
                      alt={feature.title}
                      loading="lazy"
                      className="w-full h-auto rounded-2xl shadow-lg object-cover aspect-video"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://placehold.co/600x400/e8f5e9/2e7d32?text=' + feature.title
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Honest disclaimer below the feature cards */}
            <p className="text-sm text-gray-500 text-center max-w-xl mt-4">
              Results vary based on effort, consistency, and starting skills. Most people see their
              first meaningful income in 3–12 months.{' '}
              <a href="/disclaimer" className="underline text-brand-green-800">
                Full income disclaimer
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
