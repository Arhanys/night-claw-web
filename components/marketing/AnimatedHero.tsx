"use client"

import { useRef, ReactNode } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"

interface Props {
  children: ReactNode
  className?: string
}

export default function AnimatedHero({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!ref.current) return

      // Pre-hide all targets synchronously before browser paint
      gsap.set(".hero-badge",      { opacity: 0, y: -16, scale: 0.9 })
      gsap.set(".hero-title-word", { opacity: 0, y: 32 })
      gsap.set(".hero-subtitle",   { opacity: 0, y: 18 })
      gsap.set(".hero-cta",        { opacity: 0, y: 12, scale: 0.96 })
      gsap.set(".hero-bullet",     { opacity: 0, x: -12 })

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.to(".hero-badge",      { opacity: 1, y: 0, scale: 1, duration: 0.55 })
        .to(".hero-title-word", { opacity: 1, y: 0, stagger: 0.08, duration: 0.65 }, "-=0.3")
        .to(".hero-subtitle",   { opacity: 1, y: 0, duration: 0.55 }, "-=0.4")
        .to(".hero-cta",        { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.45 }, "-=0.35")
        .to(".hero-bullet",     { opacity: 1, x: 0, stagger: 0.08, duration: 0.35 }, "-=0.25")
        .then(() => {
          gsap.set(
            [".hero-badge", ".hero-title-word", ".hero-subtitle", ".hero-cta", ".hero-bullet"],
            { clearProps: "all" }
          )
        })
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
