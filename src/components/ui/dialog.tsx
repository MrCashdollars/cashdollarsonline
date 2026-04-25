// Adapted from 4.txt (dialog.tsx + demo)
// Changes from original:
//   • Copy updated to CDO lead magnet capture
//   • Brand colors applied to icon + button
//   • CAN-SPAM compliant opt-in note added
//   • No fake urgency, no fake scarcity (CLAUDE.md §8)
//   • SendFox form wiring stubbed — confirm form ID with user before going live

'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail } from 'lucide-react'

/* ── Radix Dialog primitives (unchanged) ────────────────────────────── */
const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-[101] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-[101] grid max-h-[calc(100%-4rem)] w-full -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto border bg-background p-6 shadow-lg shadow-black/5 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-[420px] sm:rounded-xl',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="group absolute right-3 top-3 flex size-7 items-center justify-center rounded-lg outline-offset-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none">
        <Cross2Icon width={16} height={16} className="opacity-60 transition-opacity group-hover:opacity-100" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3', className)} {...props} />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold tracking-tight', className)} {...props} />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogOverlay, DialogPortal,
  DialogTitle, DialogTrigger,
}

/* ── CDO Lead Magnet Capture Dialog ─────────────────────────────────── */
export function LeadMagnetDialog() {
  const [email, setEmail] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: replace with SendFox API call via src/lib/sendfox.ts
    // Confirm SENDFOX_LIST_ID with user before wiring
    console.warn('SendFox not yet wired — confirm form ID with user first')
    setSubmitted(true)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-brand-green-800 text-white hover:bg-brand-green-900 rounded-full px-6 py-2 font-semibold"
          style={{ backgroundColor: '#2E7D32' }}
        >
          Get the Free Guide
        </Button>
      </DialogTrigger>

      <DialogContent>
        {submitted ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-semibold text-lg mb-2">You're in!</h3>
            <p className="text-sm text-muted-foreground">
              {/* [DRAFT — user to review] */}
              Check your inbox — the guide is on its way. If you don't see it in 5 minutes, check
              your spam folder.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-2 flex flex-col items-center gap-2">
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-full border-2"
                style={{ borderColor: '#2E7D32' }}
                aria-hidden="true"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <DialogHeader>
                <DialogTitle className="sm:text-center">
                  {/* [DRAFT — user to review] */}
                  Get Your Free Starter Guide
                </DialogTitle>
                <DialogDescription className="sm:text-center">
                  {/* [DRAFT — user to review] */}
                  A practical roadmap for your first $100 online. No fluff, no upsell inside.
                </DialogDescription>
              </DialogHeader>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="relative">
                <Input
                  id="dialog-email"
                  className="peer ps-9"
                  placeholder="your@email.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80">
                  <Mail size={16} strokeWidth={2} aria-hidden="true" />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full font-semibold"
                style={{ backgroundColor: '#2E7D32', color: 'white' }}
              >
                Send Me the Guide
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground">
              Opt-in only. No spam. Unsubscribe any time.{' '}
              <a href="/privacy" className="underline hover:no-underline">
                Privacy policy
              </a>
              .
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
