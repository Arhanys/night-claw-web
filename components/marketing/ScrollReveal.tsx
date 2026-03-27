"use client"

import { useRef, ReactNode } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface Props {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: number
  y?: number
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  stagger = 0.12,
  y = 28,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!ref.current) return
      const targets =
        ref.current.children.length > 0
          ? Array.from(ref.current.children)
          : [ref.current]

      // Set hidden state synchronously (runs in useLayoutEffect, before browser paint)
      gsap.set(targets, { opacity: 0, y })

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 92%",
        once: true,
        onEnter: () => {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            stagger,
            duration: 0.65,
            ease: "power2.out",
            delay,
            onComplete: () => { gsap.set(targets, { clearProps: "all" }) },
          })
        },
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
