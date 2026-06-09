'use client'

import { useRef, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother)

// Site-wide motion defaults. Every tween without an explicit ease/duration
// inherits these, so pacing stays consistent across pages and components.
gsap.defaults({
  ease: 'power3.out',
  duration: 0.6,
})

type Props = { children: ReactNode }

export function SmoothScroll({ children }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // ScrollSmoother lives in the persistent root layout, so it is created once
  // and survives client-side navigation (its refs never change).
  useGSAP(
    () => {
      // The "motion-ready" class gates the initial-hidden CSS state for
      // [data-reveal] — without it, JS-disabled users would see blank sections.
      document.documentElement.classList.add('motion-ready')

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const isTouch = window.matchMedia('(hover: none)').matches

      // Skip the smoother where native feel wins: touch devices already have
      // momentum scroll, and reduced-motion users have asked for less of it.
      if (reduced || isTouch) return

      const smoother = ScrollSmoother.create({
        wrapper: wrapperRef.current!,
        content: contentRef.current!,
        smooth: 1.2,
        effects: true,
        normalizeScroll: true,
      })

      return () => {
        smoother.kill()
      }
    },
    { scope: wrapperRef },
  )

  // Site-wide scroll reveal — any element with [data-reveal] fades and rises
  // 28px into place when it enters the viewport. This re-runs on every route
  // change: the layout (and its triggers) persists across navigation, so a
  // freshly mounted page needs its own batch — otherwise its [data-reveal]
  // sections keep the initial opacity:0 CSS and never animate in.
  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set('[data-reveal]', { opacity: 1, y: 0, clearProps: 'transform' })
        return
      }

      const batch = ScrollTrigger.batch('[data-reveal]', {
        start: 'top 85%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            overwrite: 'auto',
          }),
      })

      // Recompute trigger positions against the new page height so the
      // smoother and batch agree on where each section sits.
      ScrollTrigger.refresh()

      return () => {
        batch.forEach((t) => t.kill())
      }
    },
    { scope: wrapperRef, dependencies: [pathname], revertOnUpdate: true },
  )

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
