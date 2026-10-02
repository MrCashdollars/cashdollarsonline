'use client'

import { useEffect, useRef, useState } from 'react'
import { articlePosition } from '../../lib/article-gallery'
import './blog-spotlight.css'

const message = 'Stop chasing shortcuts. Build a skill. Solve a real problem. Create something worth paying for. One honest step at a time. We don’t sell dreams. We provide roadmaps.'
// Existing draft article previews. The connected CMS does not yet contain these posts.
const posts = [
  { slug: 'affiliate-marketing-beginners-guide', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&auto=format&fit=crop&q=60', title: "Affiliate Marketing: A Beginner's Honest Guide", category: 'Affiliate Marketing', readTime: '8 min read' },
  { slug: 'digital-products-first-100-dollars', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&auto=format&fit=crop&q=60', title: 'How I Made My First $100 Selling a Digital Product', category: 'Digital Products', readTime: '6 min read' },
  { slug: 'youtube-monetization-real-timeline', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&auto=format&fit=crop&q=60', title: 'YouTube Monetization: The Real Timeline Nobody Talks About', category: 'Content Monetization', readTime: '10 min read' },
]

export function BlogCards() {
  const section = useRef<HTMLElement>(null)
  const gallery = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [inView, setInView] = useState(false)
  const [visible, setVisible] = useState(true)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [characters, setCharacters] = useState(message.length)
  const finished = characters >= message.length
  const running = ready && inView && visible && !reduced && !paused && !hovered && !focused

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => {
      setReduced(media.matches)
      if (media.matches) setCharacters(message.length)
    }
    syncMotion()
    if (!media.matches) setCharacters(0)
    setReady(true)
    media.addEventListener('change', syncMotion)
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { threshold: 0.12 })
    if (section.current) observer.observe(section.current)
    const syncVisibility = () => setVisible(!document.hidden)
    syncVisibility()
    document.addEventListener('visibilitychange', syncVisibility)
    return () => {
      media.removeEventListener('change', syncMotion)
      observer.disconnect()
      document.removeEventListener('visibilitychange', syncVisibility)
    }
  }, [])

  useEffect(() => {
    if (!ready || reduced || !gallery.current) return
    const element = gallery.current
    let width = element.clientWidth
    const draw = () => {
      element.querySelectorAll<HTMLElement>('.article-depth-card').forEach((card, index) => {
        const p = articlePosition(index, posts.length, progress.current, width)
        card.style.transform = `translate3d(calc(-50% + ${p.x}px), 0, ${p.z}px) rotateY(${p.rotate}deg)`
        card.style.opacity = String(p.opacity)
        card.style.zIndex = String(Math.round(200 + p.z))
      })
    }
    const resize = new ResizeObserver(() => { width = element.clientWidth; draw() })
    resize.observe(element)
    draw()
    let frame = 0
    let previous = 0
    const animate = (now: number) => {
      if (previous) progress.current = (progress.current + Math.min(now - previous, 100) / 28000) % 1
      previous = now
      draw()
      frame = requestAnimationFrame(animate)
    }
    if (running) frame = requestAnimationFrame(animate)
    return () => { cancelAnimationFrame(frame); resize.disconnect() }
  }, [ready, reduced, running])

  useEffect(() => {
    if (!running) return
    // Leave the completed message readable before replaying the typing sequence.
    if (finished) {
      const restart = window.setTimeout(() => setCharacters(0), 6500)
      return () => window.clearTimeout(restart)
    }
    const timer = window.setInterval(() => setCharacters(count => Math.min(count + 1, message.length)), 65)
    return () => window.clearInterval(timer)
  }, [running, finished])

  return (
    <section ref={section} className="blog-spotlight" aria-labelledby="blog-spotlight-heading" data-running={running} data-typing={running && characters < message.length}>
      <header className="blog-spotlight-heading">
        <h2 id="blog-spotlight-heading">From the Blog</h2>
        <p>Honest, practical articles on building supplemental income. No fluff, no recycled advice.</p>
      </header>
      <div className="blog-spotlight-layout">
        <div className="creator-workspace">
          <div className="avatar-typing" role="img" aria-label="Your avatar seated facing right, looking at his laptop and typing">
            <div className="avatar-laptop-brand" aria-hidden="true">
              <span>CashDollarsOnline</span>
              <img src="/logo.png" width="500" height="500" alt="" loading="lazy" />
            </div>
          </div>
          <div className="creator-message">
            <div className="creator-message-label" aria-hidden="true"><span className="message-status-dot" /> A roadmap worth building</div>
            <p className="sr-only">{message}</p>
            <div className="creator-message-text" aria-hidden="true">
              <p className="creator-message-reserve">{message}</p>
              <p className="creator-message-copy">{message.slice(0, characters)}<span className="typing-cursor" /></p>
            </div>
          </div>
        </div>
        <div className="article-gallery-area">
          <div className="article-gallery-toolbar">
            <p>Ideas to put into practice</p>
            <button type="button" disabled={!ready || reduced} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{!ready || reduced ? 'Motion off' : paused ? 'Resume motion' : 'Pause motion'}</button>
          </div>
          {/* Render the same depth layout before hydration to keep section height stable. */}
          <div ref={gallery} className="article-depth-gallery" data-depth={!reduced} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
            {posts.map(post => (
              <a key={post.slug} href="/blog" className="article-depth-card" aria-label={`Browse the blog — ${post.title} (draft preview)`}>
                <img src={post.image} alt="" loading="lazy" width="1200" height="800" />
                <div className="article-depth-caption">
                  <span className="article-depth-category">{post.category} · Draft preview</span>
                  <h3>{post.title}</h3>
                  <span className="article-depth-readtime">Browse the blog <span aria-hidden="true">↗</span></span>
                </div>
              </a>
            ))}
          </div>
          <p className="article-gallery-hint">Pause to explore. Each article is a step forward.</p>
        </div>
      </div>
      <a href="/blog" className="blog-all-articles">View all articles →</a>
    </section>
  )
}
