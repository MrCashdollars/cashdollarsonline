'use client'

import type React from 'react'
import { useState, useRef } from 'react'
import {
  Search,
  ArrowUp,
  Plus,
  FileText,
  TrendingUp,
  ShoppingBag,
  Video,
  Sparkles,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LeadMagnetDialog } from './dialog'

/* ── CDO-specific command suggestions ──────────────────────────────── */
const commandSuggestions = {
  income: [
    'How long does it take to make my first $100 online?',
    'What is the easiest way to start with under $100?',
    'Is affiliate marketing still worth it in 2025?',
    'What are the real costs of starting a digital products business?',
    'How many hours per week does this actually take?',
  ],
  affiliate: [
    'Which affiliate networks pay the highest commissions?',
    'How do I pick products to promote without losing credibility?',
    'Do I need a website to do affiliate marketing?',
    'What is a realistic first-month income from affiliate marketing?',
    'How do I disclose affiliate links properly?',
  ],
  digital: [
    'What kind of digital product should I create first?',
    'How do I price an ebook or template?',
    'What platforms can I sell digital downloads on?',
    'How long does it take to create and launch a digital product?',
    'Do I need design skills to make a digital product?',
  ],
}

type CategoryKey = keyof typeof commandSuggestions

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SESSION_KEY = 'cdo_msg_count'
const MSG_LIMIT = 5
const ERROR_MSG =
  'The AI assistant is temporarily unavailable — please try again shortly.'

function getSessionCount(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(sessionStorage.getItem(SESSION_KEY) ?? '0', 10)
}

function incrementSessionCount(): number {
  const next = getSessionCount() + 1
  sessionStorage.setItem(SESSION_KEY, String(next))
  return next
}

export function AIAssistantInterface() {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [showUploadAnimation, setShowUploadAnimation] = useState(false)
  const [activeCommandCategory, setActiveCommandCategory] = useState<CategoryKey | null>(null)
  const [showRateLimitCTA, setShowRateLimitCTA] = useState(() => getSessionCount() >= MSG_LIMIT)
  const inputRef = useRef<HTMLInputElement>(null)
  const isSendingRef = useRef(false)

  const handleUploadFile = () => {
    setShowUploadAnimation(true)
    setTimeout(() => {
      setUploadedFiles((prev) => [...prev, 'Document.pdf'])
      setShowUploadAnimation(false)
    }, 1500)
  }

  const handleCommandSelect = (command: string) => {
    setInputValue(command)
    setActiveCommandCategory(null)
    inputRef.current?.focus()
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || showRateLimitCTA || isSendingRef.current) return
    isSendingRef.current = true

    if (getSessionCount() >= MSG_LIMIT) {
      setShowRateLimitCTA(true)
      return
    }

    const userMessage = inputValue.trim()
    const currentHistory = messages
    setInputValue('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsTyping(true)

    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: currentHistory }),
      })

      if (!response.ok || !response.body) throw new Error('Request failed')

      reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantAdded = false
      let finished = false

      while (!finished) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        const lines = text.split('\n\n').filter(Boolean)

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)

          if (data === '[DONE]') {
            const newCount = incrementSessionCount()
            if (newCount >= MSG_LIMIT) setShowRateLimitCTA(true)
            finished = true
            break
          }

          try {
            const parsed = JSON.parse(data) as { token?: string; error?: string }

            if (parsed.error) {
              setMessages((prev) => [...prev, { role: 'assistant', content: ERROR_MSG }])
              finished = true
              break
            }

            if (parsed.token) {
              if (!assistantAdded) {
                setIsTyping(false)
                setMessages((prev) => [...prev, { role: 'assistant', content: parsed.token! }])
                assistantAdded = true
              } else {
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: updated[updated.length - 1].content + parsed.token,
                  }
                  return updated
                })
              }
            }
          } catch {
            // ignore malformed chunk
          }
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: ERROR_MSG }])
    } finally {
      setIsTyping(false)
      isSendingRef.current = false
      reader?.releaseLock()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="w-full bg-white py-16 px-4">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">

        {/* CDO logo */}
        <img
          src="/logo.png"
          alt="Cash Dollars Online"
          className="mb-6 w-16 h-16 rounded-full object-cover"
        />

        {/* Heading */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Ask Me Anything
            </h2>
            <p className="text-gray-500 max-w-md text-sm sm:text-base">
              Questions about making money online? Ask below. I'm trained on the Cash Dollars Online
              content library — real answers, no hype.
            </p>
          </motion.div>
        </div>

        {/* Chat history */}
        {messages.length > 0 && (
          <div className="w-full mb-4 space-y-3 max-h-72 overflow-y-auto" role="log" aria-live="polite" aria-label="Chat messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  style={msg.role === 'user' ? { backgroundColor: '#2E7D32' } : {}}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#2E7D32' }}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rate limit CTA — shown after 5 messages */}
        {showRateLimitCTA ? (
          <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center mb-4">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              You've used your 5 free questions
            </h3>
            <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
              Join our newsletter for unlimited access to CDO AI and members-only content.
            </p>
            <LeadMagnetDialog />
          </div>
        ) : (
          <>
            {/* Input box */}
            <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
              <div className="p-4">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask about affiliate marketing, digital products, or income strategies..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full text-gray-700 text-base outline-none placeholder:text-gray-400"
                />
              </div>

              {/* Uploaded files */}
              {uploadedFiles.length > 0 && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 py-1 px-2 rounded-md border border-gray-200">
                      <FileText className="w-3 h-3" style={{ color: '#2E7D32' }} />
                      <span className="text-xs text-gray-700">{file}</span>
                      <button
                        onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== index))}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Remove file"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom toolbar */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                    <Sparkles className="w-3 h-3" />
                    <span>CDO AI</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUploadFile}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Upload file"
                  >
                    {showUploadAnimation ? (
                      <motion.div className="flex space-x-0.5"
                        initial="hidden" animate="visible"
                        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: '#2E7D32' }}
                            variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, repeat: Infinity, repeatType: 'mirror', delay: i * 0.1 } } }}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="w-8 h-8 flex items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: inputValue.trim() && !isTyping ? '#2E7D32' : '#e5e7eb',
                      color: inputValue.trim() && !isTyping ? 'white' : '#9ca3af',
                    }}
                    aria-label="Send message"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category buttons */}
            <div className="w-full grid grid-cols-3 gap-3 mb-4">
              <CommandButton
                icon={<TrendingUp className="w-5 h-5" />}
                label="Income Ideas"
                isActive={activeCommandCategory === 'income'}
                onClick={() => setActiveCommandCategory(activeCommandCategory === 'income' ? null : 'income')}
              />
              <CommandButton
                icon={<ShoppingBag className="w-5 h-5" />}
                label="Affiliate"
                isActive={activeCommandCategory === 'affiliate'}
                onClick={() => setActiveCommandCategory(activeCommandCategory === 'affiliate' ? null : 'affiliate')}
              />
              <CommandButton
                icon={<Video className="w-5 h-5" />}
                label="Digital Products"
                isActive={activeCommandCategory === 'digital'}
                onClick={() => setActiveCommandCategory(activeCommandCategory === 'digital' ? null : 'digital')}
              />
            </div>

            {/* Suggestion list */}
            <AnimatePresence>
              {activeCommandCategory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full mb-6 overflow-hidden"
                >
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-3 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700">
                        {activeCommandCategory === 'income'
                          ? 'Income strategy questions'
                          : activeCommandCategory === 'affiliate'
                          ? 'Affiliate marketing questions'
                          : 'Digital product questions'}
                      </h3>
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {commandSuggestions[activeCommandCategory].map((suggestion, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => handleCommandSelect(suggestion)}
                          className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#2E7D32' }} />
                            <span className="text-sm text-gray-700">{suggestion}</span>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        <p className="text-xs text-gray-400 text-center mt-2">
          AI responses are for educational purposes only. Not financial advice.{' '}
          <a href="/disclaimer" className="underline text-gray-400">Disclaimer</a>.
        </p>
      </div>
    </div>
  )
}

/* ── Command category button ────────────────────────────────────────── */
interface CommandButtonProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}

function CommandButton({ icon, label, isActive, onClick }: CommandButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
        isActive
          ? 'border-brand-green-200 shadow-sm'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
      style={isActive ? { backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' } : {}}
    >
      <div style={{ color: isActive ? '#2E7D32' : '#6b7280' }}>{icon}</div>
      <span className="text-sm font-medium" style={{ color: isActive ? '#1B5E20' : '#374151' }}>
        {label}
      </span>
    </motion.button>
  )
}
