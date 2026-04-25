// Adapted from 6.txt (cards.tsx)
// Contains two separate exported components:
//   1. BlogCards     — recent blog post preview cards
//   2. TestimonialMarquee — infinite scrolling testimonial rows
//
// Changes from original:
//   • Two default exports fixed → named exports BlogCards + TestimonialMarquee
//   • indigo-600 → brand-green-800
//   • Blog post content updated to CDO topics
//   • Testimonial data marked [DRAFT] — MUST be replaced with real,
//     verifiable testimonials before going live (CLAUDE.md §8)
//   • Google Fonts import removed — uses Inter from global CSS
//   • [DRAFT] markers added to all copy per CLAUDE.md §14

'use client'

import React from 'react'

/* ═══════════════════════════════════════════════════════════════════
   1. BLOG CARDS
   ═══════════════════════════════════════════════════════════════════ */

const blogPosts = [
  {
    slug: 'affiliate-marketing-beginners-guide',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&auto=format&fit=crop&q=60',
    title: 'Affiliate Marketing: A Beginner\'s Honest Guide',  // [DRAFT — user to review]
    category: 'Affiliate Marketing',
    readTime: '8 min read',
  },
  {
    slug: 'digital-products-first-100-dollars',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&auto=format&fit=crop&q=60',
    title: 'How I Made My First $100 Selling a Digital Product',  // [DRAFT — user to review]
    category: 'Digital Products',
    readTime: '6 min read',
  },
  {
    slug: 'youtube-monetization-real-timeline',
    image:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&auto=format&fit=crop&q=60',
    title: 'YouTube Monetization: The Real Timeline Nobody Talks About',  // [DRAFT — user to review]
    category: 'Content Monetization',
    readTime: '10 min read',
  },
]

export function BlogCards() {
  return (
    <div className="flex flex-col items-center w-full py-16 px-4 bg-white">
      <h2 className="text-3xl font-semibold text-gray-900">From the Blog</h2>
      <p className="text-sm text-gray-500 mt-2 max-w-lg text-center">
        {/* [DRAFT — user to review] */}
        Honest, practical articles on building supplemental income. No fluff, no recycled advice.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-8 w-full max-w-5xl">
        {blogPosts.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="max-w-72 w-full hover:-translate-y-1 transition-transform duration-300 no-underline group"
          >
            <img
              className="rounded-xl w-full aspect-video object-cover"
              src={post.image}
              alt={post.title}
              loading="lazy"
            />
            <h3 className="text-base text-gray-900 font-medium mt-3 group-hover:text-brand-green-800 transition-colors">
              {post.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p
                className="text-xs font-medium"
                style={{ color: '#2E7D32' }}
              >
                {post.category}
              </p>
              <span className="text-gray-300">·</span>
              <p className="text-xs text-gray-400">{post.readTime}</p>
            </div>
          </a>
        ))}
      </div>

      <a
        href="/blog"
        className="mt-10 text-sm font-semibold no-underline hover:underline transition-colors"
        style={{ color: '#2E7D32' }}
      >
        View all articles →
      </a>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   2. TESTIMONIAL MARQUEE
   IMPORTANT: DEFAULT_DATA below is [DRAFT] placeholder.
   Replace with real, verifiable testimonials before launch.
   Fake or unverifiable testimonials violate CLAUDE.md §8.
   ═══════════════════════════════════════════════════════════════════ */

type CardT = {
  image: string
  name: string
  handle: string
  quote: string
  date?: string
}

// [DRAFT] — MUST be replaced with real testimonials from actual subscribers/viewers
// Each person must consent to being quoted. See CLAUDE.md §8.
const DRAFT_TESTIMONIALS: CardT[] = [
  {
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
    name: '[DRAFT — real name needed]',
    handle: '@username',
    quote: '[DRAFT] Replace with a real testimonial from a real subscriber. Do not fabricate.',
  },
  {
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    name: '[DRAFT — real name needed]',
    handle: '@username',
    quote: '[DRAFT] Replace with a real testimonial from a real subscriber. Do not fabricate.',
  },
  {
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200',
    name: '[DRAFT — real name needed]',
    handle: '@username',
    quote: '[DRAFT] Replace with a real testimonial from a real subscriber. Do not fabricate.',
  },
  {
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200',
    name: '[DRAFT — real name needed]',
    handle: '@username',
    quote: '[DRAFT] Replace with a real testimonial from a real subscriber. Do not fabricate.',
  },
]

const TestimonialCard = ({ card }: { card: CardT }) => (
  <div className="p-4 rounded-xl mx-4 shadow hover:shadow-md transition-all duration-200 w-72 shrink-0 bg-white border border-gray-100">
    <div className="flex gap-2 mb-3">
      <img
        className="size-10 rounded-full object-cover"
        src={card.image}
        alt={card.name}
      />
      <div className="flex flex-col">
        <p className="font-medium text-sm text-gray-900">{card.name}</p>
        <span className="text-xs text-gray-400">{card.handle}</span>
      </div>
    </div>
    <p className="text-sm text-gray-700 leading-relaxed">{card.quote}</p>
  </div>
)

function MarqueeRow({
  data,
  reverse = false,
  speed = 30,
}: {
  data: CardT[]
  reverse?: boolean
  speed?: number
}) {
  const doubled = React.useMemo(() => [...data, ...data], [data])
  return (
    <div className="relative w-full mx-auto max-w-5xl overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 md:w-32 z-10 bg-gradient-to-r from-gray-50 to-transparent" />
      <div
        className={`flex transform-gpu min-w-[200%] ${reverse ? 'pt-4 pb-8' : 'pt-8 pb-4'}`}
        style={{
          animation: `marqueeScroll ${speed}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {doubled.map((c, i) => (
          <TestimonialCard key={i} card={c} />
        ))}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 md:w-32 z-10 bg-gradient-to-l from-gray-50 to-transparent" />
    </div>
  )
}

export function TestimonialMarquee({
  row1 = DRAFT_TESTIMONIALS,
  row2 = DRAFT_TESTIMONIALS,
}: {
  row1?: CardT[]
  row2?: CardT[]
}) {
  return (
    <div className="bg-gray-50 py-16 w-full">
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl font-semibold text-gray-900">What Readers Are Saying</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          {/* [DRAFT — replace with real subscriber count once confirmed] */}
          Real feedback from people building income alongside their day jobs.
        </p>
        {/* Visible [DRAFT] warning — remove once real testimonials are in place */}
        <p className="text-xs text-amber-600 mt-2 font-medium">
          ⚠ [DRAFT] Testimonials below are placeholders. Replace with real quotes before launch.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <MarqueeRow data={row1} reverse={false} speed={30} />
        <MarqueeRow data={row2} reverse={true} speed={30} />
      </div>
    </div>
  )
}
