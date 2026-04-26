// Adapted from 2.txt (hero-section.tsx / Others1)
// Changes from original:
//   • next/link → <a>  |  next/image → <img>
//   • TimelineContent + ProgressiveBlur sourced from local components
//   • Nav replaced with CDO links; Discord/GitHub → YouTube
//   • blocksDesign → CDO content categories with relevant Unsplash images
//   • Headline/copy updated to CDO brand voice
//   • Logo SVG replaced with CDO wordmark text

'use client'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { TimelineContent } from '@/components/ui/timeline-animation'

// CDO content categories — replaces UILayouts block categories
const contentCategories = [
  {
    id: 'affiliate-marketing',
    name: 'Affiliate Marketing',
    href: '/videos#affiliate',
    description: 'Earn commissions promoting products you trust.',
    imgSrc: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=687&auto=format&fit=crop&q=80',
    imgClass: 'object-cover',
    textClass: 'text-white',
  },
  {
    id: 'digital-products',
    name: 'Digital Products',
    href: '/videos#digital-products',
    description: 'Create once, sell repeatedly.',
    imgSrc: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=687&auto=format&fit=crop&q=80',
    imgClass: 'object-cover',
    textClass: 'text-white',
  },
  {
    id: 'content-monetization',
    name: 'Content Monetization',
    href: '/videos#content',
    description: 'Turn your knowledge into an audience that pays.',
    imgSrc: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=687&auto=format&fit=crop&q=80',
    imgClass: 'object-cover',
    textClass: 'text-white',
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    href: '/resources#email',
    description: 'Build a list you own — independent of any algorithm.',
    imgSrc: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=687&auto=format&fit=crop&q=80',
    imgClass: 'object-cover',
    textClass: 'text-white',
  },
  {
    id: 'free-guides',
    name: 'Free Guides',
    href: '/free-guides',
    description: 'Structured roadmaps you can download and use today.',
    imgSrc: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=687&auto=format&fit=crop&q=80',
    imgClass: 'object-cover',
    textClass: 'text-white',
  },
  {
    id: 'youtube-strategy',
    name: 'YouTube Strategy',
    href: '/videos',
    description: 'Build a channel that generates real income over time.',
    imgSrc: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=687&auto=format&fit=crop&q=80',
    imgClass: 'object-cover',
    textClass: 'text-white',
  },
]

const revealVariants = {
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { delay: i * 0.3, duration: 0.5 },
  }),
  hidden: { filter: 'blur(10px)', y: -20, opacity: 0 },
}

function HeroSection() {
  const timelineRef = useRef<HTMLDivElement>(null)

  return (
    <main ref={timelineRef} className="bg-white">
      {/* ── Main content ───────────────────────────────────────────── */}
      <div className="pt-16 pb-8 max-w-screen-xl mx-auto min-h-[80vh] px-4">
        <article className="w-fit mx-auto max-w-3xl text-center space-y-6">

          {/* Badge */}
          <TimelineContent
            as="a"
            href="/free-guides"
            animationNum={1}
            timelineRef={timelineRef}
            customVariants={revealVariants}
            className="flex w-fit mx-auto items-center gap-1 rounded-full bg-brand-green-800 border-4 border-brand-green-100 py-0.5 pl-0.5 pr-3 text-xs no-underline"
          >
            <div className="rounded-full bg-white px-2 py-1 text-xs text-brand-green-800 font-semibold">
              New
            </div>
            <p className="text-white sm:text-base text-xs inline-block">
              ✨ Free guides{' '}
              <span className="px-1 font-semibold">just updated</span>
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-white">
              <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </TimelineContent>

          {/* Headline */}
          <TimelineContent
            as="h2"
            animationNum={2}
            timelineRef={timelineRef}
            customVariants={revealVariants}
            className="text-5xl sm:text-6xl font-bold text-gray-900 leading-[100%] tracking-tight"
          >
            {/* [DRAFT — user to review] */}
            Build Real Income Online.{' '}
            <span className="bg-gradient-to-r from-brand-green-700 to-brand-green-900 bg-clip-text text-transparent">
              No Hype.
            </span>{' '}
            <span className="bg-gradient-to-r from-brand-yellow-700 to-brand-yellow-900 bg-clip-text text-transparent">
              Just Results.
            </span>
          </TimelineContent>

          {/* Subtitle */}
          <TimelineContent
            as="p"
            animationNum={3}
            timelineRef={timelineRef}
            customVariants={revealVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            {/* [DRAFT — user to review] */}
            Honest strategies, realistic timelines, and free tutorials — covering affiliate
            marketing, digital products, and content monetization. All free.
          </TimelineContent>
        </article>

        {/* ── Content category grid ────────────────────────���──────── */}
        <div className="grid md:grid-cols-3 grid-cols-2 gap-4 pt-16 max-w-5xl mx-auto">
          {contentCategories.map((category, index) => (
            <TimelineContent
              key={category.id}
              as="a"
              animationNum={index + 4}
              timelineRef={timelineRef}
              href={category.href}
              className="transition-all aspect-video rounded-xl backdrop-blur-sm overflow-hidden relative block no-underline group"
            >
              <figure className="relative h-full w-full">
                {category.id === 'youtube-strategy' ? (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: '#FF0000' }}
                  >
                    {/* YouTube official logo SVG */}
                    <svg viewBox="0 0 90 63" className="w-20 h-14" fill="white" aria-label="YouTube">
                      <path d="M88.15 9.83A11.3 11.3 0 0 0 80.21 1.88C73.21 0 45 0 45 0S16.79 0 9.79 1.88A11.3 11.3 0 0 0 1.85 9.83C0 16.83 0 31.5 0 31.5s0 14.67 1.85 21.67A11.3 11.3 0 0 0 9.79 61.12C16.79 63 45 63 45 63s28.21 0 35.21-1.88a11.3 11.3 0 0 0 7.94-7.95C90 46.17 90 31.5 90 31.5s0-14.67-1.85-21.67zM35.8 45V18l23.6 13.5L35.8 45z"/>
                    </svg>
                  </div>
                ) : (
                  <img
                    src={category.imgSrc}
                    alt={category.name}
                    className={cn('w-full h-full', category.imgClass, 'group-hover:scale-105 transition-transform duration-500')}
                    loading="lazy"
                  />
                )}
              </figure>
              <ProgressiveBlur
                className="pointer-events-none absolute bottom-0 left-0 h-[40%] w-full"
                blurIntensity={0.5}
              />
              <div className="absolute bottom-2 left-3">
                <h3 className="text-sm sm:text-base font-semibold text-white leading-tight">
                  {category.name}
                </h3>
              </div>
            </TimelineContent>
          ))}
        </div>
      </div>
    </main>
  )
}

export default HeroSection
