'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, type ElementType, type ComponentPropsWithoutRef, type ReactNode } from 'react'

type AnyProps = Record<string, unknown>

interface TimelineContentProps extends AnyProps {
  as?: ElementType
  animationNum?: number
  timelineRef?: React.RefObject<HTMLElement | null>
  customVariants?: {
    visible: (i: number) => object
    hidden: object
  }
  children?: ReactNode
  className?: string
}

const defaultVariants = {
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { delay: i * 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
  hidden: {
    y: -20,
    opacity: 0,
    filter: 'blur(10px)',
  },
}

export function TimelineContent({
  as: Tag = 'div',
  animationNum = 1,
  timelineRef: _timelineRef,
  customVariants,
  children,
  className,
  ...props
}: TimelineContentProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref as React.RefObject<Element>, { once: true })
  const variants = customVariants ?? defaultVariants

  // motion() creates a motion-enhanced version of any HTML element
  const MotionTag = motion(Tag as keyof JSX.IntrinsicElements) as React.ComponentType<AnyProps>

  return (
    <MotionTag
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={animationNum}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  )
}
