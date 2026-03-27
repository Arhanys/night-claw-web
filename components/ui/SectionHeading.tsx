import { cn } from "@/lib/utils"

interface Props {
  title: string
  subtitle?: string
  badge?: string
  align?: "left" | "center"
  className?: string
  accentColor?: "violet" | "cyan"
}

export default function SectionHeading({
  title,
  subtitle,
  badge,
  align = "center",
  className,
  accentColor = "violet",
}: Props) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", "mb-10", className)}>
      {badge && (
        <span
          className={cn(
            "inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 border",
            accentColor === "violet"
              ? "bg-accent/10 text-accent border-accent/25"
              : "bg-accent-secondary/10 text-accent-secondary border-accent-secondary/25"
          )}
        >
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-lg text-text-muted leading-relaxed",
            align === "center" && "max-w-2xl mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
