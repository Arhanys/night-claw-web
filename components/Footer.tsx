"use client"

import Link from "next/link"
import { useI18n, useCurrentLocale } from "@/locales/client"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUp, LayoutDashboard } from "lucide-react"
import { BOT_INVITE_URL } from "@/lib/constants"

export default function Footer() {
  const t = useI18n()
  const locale = useCurrentLocale()

  return (
    <footer className="relative mt-auto bg-card/50">

      {/* ─── Animated top border ───────────────────────────────────────────── */}
      {/* Static base border */}
      <div className="absolute inset-x-0 top-0 h-px bg-border" />
      {/* Sweeping comet — a bright spot of gradient that loops left-to-right */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, transparent 20%, color-mix(in srgb, var(--accent-primary) 60%, transparent) 35%, var(--accent-secondary) 50%, color-mix(in srgb, var(--accent-primary) 60%, transparent) 65%, transparent 80%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "footer-sweep 5s ease-in-out infinite",
          filter: "blur(0.4px)",
        }}
      />
      {/* Glow bloom below the sweeping line */}
      <div
        className="absolute inset-x-0 top-0 h-6 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, transparent 20%, color-mix(in srgb, var(--accent-primary) 10%, transparent) 35%, color-mix(in srgb, var(--accent-secondary) 12%, transparent) 50%, color-mix(in srgb, var(--accent-primary) 10%, transparent) 65%, transparent 80%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "footer-sweep 5s ease-in-out infinite",
        }}
      />

      {/* ─── Content ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
          {/* Brand */}
          <div className="shrink-0">
            <Link href="/">
              <span className="text-lg font-bold font-display tracking-tight">
                Night<span className="gradient-text">Claw</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm mt-1">{t("footer.tagline")}</p>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1 flex-wrap">
            <Link
              href="/guide"
              className="px-3 py-1.5 text-sm text-text-muted hover:text-text transition-colors rounded-lg hover:bg-elevated"
            >
              {t("Nav.guide")}
            </Link>
            <Link
              href="/about"
              className="px-3 py-1.5 text-sm text-text-muted hover:text-text transition-colors rounded-lg hover:bg-elevated"
            >
              {t("Nav.about")}
            </Link>
            <Link
              href="/contact"
              className="px-3 py-1.5 text-sm text-text-muted hover:text-text transition-colors rounded-lg hover:bg-elevated"
            >
              {t("Nav.contact")}
            </Link>
            <Link
              href={`/${locale}/dashboard`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-muted hover:text-text transition-colors rounded-lg hover:bg-elevated"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              {t("Nav.dashboard")}
            </Link>
          </nav>

          {/* CTA */}
          <Link href={BOT_INVITE_URL} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              {t("Nav.addToDiscord")}
            </Button>
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between gap-4">
          <p className="text-text-muted text-xs">{t("footer.copyright")}</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-muted hover:text-text rounded-lg hover:bg-elevated transition-all group"
            aria-label="Back to top"
          >
            <ArrowUp className="h-3 w-3 group-hover:-translate-y-0.5 transition-transform" />
            {t("footer.backToTop")}
          </button>
        </div>

      </div>
    </footer>
  )
}
