import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface Props {
  children: ReactNode
  className?: string
  glow?: "violet" | "cyan" | "none"
  hover?: boolean
  padding?: string
}

export default function GlowCard({
  children,
  className,
  glow = "violet",
  hover = true,
  padding = "p-8",
}: Props) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl",
        glow === "violet" && "card-glow-border",
        glow === "cyan" && "card-glow-border-cyan",
        hover && "hover:bg-elevated hover:border-accent/30 transition-all duration-300",
        padding,
        className
      )}
    >
      {children}
    </div>
  )
}
