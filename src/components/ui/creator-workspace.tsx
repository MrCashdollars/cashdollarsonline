'use client'

import { useEffect, useRef, useState } from 'react'
import './blog-spotlight.css'

const message = 'Stop chasing shortcuts. Build a skill. Solve a real problem. Create something worth paying for. One honest step at a time. We don’t sell dreams. We provide roadmaps.'

export function CreatorWorkspace() {
  const workspace = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [inView, setInView] = useState(false)
  const [visible, setVisible] = useState(true)
  const [paused, setPaused] = useState(false)
  const [characters, setCharacters] = useState(message.length)
  const finished = characters >= message.length
  const running = ready && inView && visible && !reduced && !paused

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
    if (workspace.current) observer.observe(workspace.current)
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
    if (!running) return
    if (finished) {
      const restart = window.setTimeout(() => setCharacters(0), 6500)
      return () => window.clearTimeout(restart)
    }
    const timer = window.setInterval(() => setCharacters(count => Math.min(count + 1, message.length)), 65)
    return () => window.clearInterval(timer)
  }, [running, finished])

  return (
    <div ref={workspace} className="creator-workspace" data-running={running} data-typing={running && !finished}>
      <div className="avatar-typing" role="img" aria-label="Your avatar seated facing right, looking at his laptop and typing">
        <div className="avatar-laptop-brand" aria-hidden="true">
          <span>CashDollarsOnline</span>
          <img src="/logo.png" width="500" height="500" alt="" loading="lazy" />
        </div>
      </div>
      <div className="creator-message">
        <div className="creator-message-label">
          <span className="message-status-dot" aria-hidden="true" />
          <span aria-hidden="true">A roadmap worth building</span>
          <button type="button" disabled={!ready || reduced} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{!ready || reduced ? 'Motion off' : paused ? 'Resume typing' : 'Pause typing'}</button>
        </div>
        <p className="sr-only">{message}</p>
        <div className="creator-message-text" aria-hidden="true">
          <p className="creator-message-reserve">{message}</p>
          <p className="creator-message-copy">{message.slice(0, characters)}<span className="typing-cursor" /></p>
        </div>
      </div>
    </div>
  )
}
