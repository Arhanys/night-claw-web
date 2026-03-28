import type { Metadata } from "next"
import { getI18n } from "@/locales/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BOT_INVITE_URL } from "@/lib/constants"
import AnimatedHero from "@/components/marketing/AnimatedHero"
import ScrollReveal from "@/components/marketing/ScrollReveal"
import GlowCard from "@/components/ui/GlowCard"
import SectionHeading from "@/components/ui/SectionHeading"
import { Zap, ShieldCheck, Crosshair, ArrowRight, Terminal, CheckCircle2 } from "lucide-react"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nightclaw.xyz"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const fr = locale === "fr"
  const title = fr
    ? "Bot de modération Discord gratuit — Bans, Appeals & Logs"
    : "Free Discord Moderation Bot — Bans, Appeals & Mod Logs"
  const description = fr
    ? "NightClaw modère votre serveur Discord avec /ban, /kick, /mute, /warn, un système d'appels de sanctions, des tickets et un tableau de bord web complet. Gratuit."
    : "NightClaw moderates your Discord server with /ban, /kick, /mute, /warn, a ban appeal system, tickets, mod logs, and a full web dashboard. Free to use."
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: { en: `${SITE_URL}/en`, fr: `${SITE_URL}/fr` },
    },
    openGraph: { title, description, url: `${SITE_URL}/${locale}` },
    twitter: { title, description },
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NightClaw",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Discord",
  url: SITE_URL,
  description:
    "NightClaw is a free Discord moderation bot with ban/kick/mute/warn commands, ban appeal system, ticket system, mod logs, and a full web dashboard.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Ban, kick, mute, warn commands",
    "Ban appeal system with web dashboard",
    "Ticket system",
    "Moderation logs",
    "Multi-language support (EN/FR)",
  ],
}

export default async function Home() {
  const t = await getI18n()

  const featureIcons = [
    { icon: Zap, color: "text-accent", bg: "bg-accent/10" },
    { icon: ShieldCheck, color: "text-accent-secondary", bg: "bg-accent-secondary/10" },
    { icon: Crosshair, color: "text-accent", bg: "bg-accent/10" },
  ]

  const stats = [
    { value: t("home.statSection.statOne.title"), label: t("home.statSection.statOne.text"), color: "text-accent" },
    { value: t("home.statSection.statTwo.title"), label: t("home.statSection.statTwo.text"), color: "text-accent-secondary" },
    { value: t("home.statSection.statThree.title"), label: t("home.statSection.statThree.text"), color: "text-accent" },
    { value: t("home.statSection.statFour.title"), label: t("home.statSection.statFour.text"), color: "text-accent-secondary" },
  ]

  const cmdFirst = [
    { cmd: t("home.commandExample.commandCard.commandFirstColumn.commandOne"), desc: t("home.commandExample.commandCard.commandFirstColumn.commandOneDesc") },
    { cmd: t("home.commandExample.commandCard.commandFirstColumn.commandTwo"), desc: t("home.commandExample.commandCard.commandFirstColumn.commandTwoDesc") },
    { cmd: t("home.commandExample.commandCard.commandFirstColumn.commandThree"), desc: t("home.commandExample.commandCard.commandFirstColumn.commandThreeDesc") },
  ]
  const cmdSecond = [
    { cmd: t("home.commandExample.commandCard.commandSecondColumn.commandOne"), desc: t("home.commandExample.commandCard.commandSecondColumn.commandOneDesc") },
    { cmd: t("home.commandExample.commandCard.commandSecondColumn.commandTwo"), desc: t("home.commandExample.commandCard.commandSecondColumn.commandTwoDesc") },
    { cmd: t("home.commandExample.commandCard.commandSecondColumn.commandThree"), desc: t("home.commandExample.commandCard.commandSecondColumn.commandThreeDesc") },
  ]

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ─── Hero ──────────────────────────────────────────── */}
      <section className="hero-glow relative pt-24 pb-32 md:pt-32 md:pb-44">
        {/* Dot grid */}
        <div className="absolute inset-0 bg-dot-grid opacity-[0.035] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <AnimatedHero className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8">
              <span className="hero-badge inline-flex items-center gap-2 px-4 py-2 border border-accent/30 bg-accent/8 text-accent rounded-full text-sm font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
                {t("home.hero.badgeTitle")}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-8xl font-bold leading-[1.05] tracking-tight mb-6">
              <span className="hero-title-word block text-text">{t("home.hero.title")}</span>
              <span className="hero-title-word block gradient-text">{t("home.hero.titleHighlight")}</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
              {t("home.hero.subtitle")}
              <span className="text-accent-secondary font-semibold"> {t("home.hero.subtitleHighlight")}</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <Link href={BOT_INVITE_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="hero-cta shadow-xl shadow-accent/25 group">
                  {t("home.hero.ctaPrimary")}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/guide#top">
                <Button variant="outline" size="lg" className="hero-cta w-full sm:w-auto">
                  {t("home.hero.ctaSecondary")}
                </Button>
              </Link>
            </div>

            {/* Bullets */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-text-muted">
              {[
                { color: "bg-accent-secondary", text: t("home.hero.bulletOne") },
                { color: "bg-accent", text: t("home.hero.bulletTwo") },
                { color: "bg-accent-secondary", text: t("home.hero.bulletThree") },
              ].map((b, i) => (
                <div key={i} className="hero-bullet flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${b.color}`} />
                  {b.text}
                </div>
              ))}
            </div>
          </AnimatedHero>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ─── Features ──────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <SectionHeading
              title={t("home.cards.title")}
              subtitle={t("home.cards.subtitle")}
              badge="Features"
              align="center"
            />
          </ScrollReveal>

          <ScrollReveal className="grid md:grid-cols-3 gap-6" stagger={0.15}>
            {[
              { title: t("home.cards.cardOne.title"), desc: t("home.cards.cardOne.description") },
              { title: t("home.cards.cardTwo.title"), desc: t("home.cards.cardTwo.description") },
              { title: t("home.cards.cardThree.title"), desc: t("home.cards.cardThree.description") },
            ].map((card, i) => {
              const { icon: Icon, color, bg } = featureIcons[i]
              return (
                <GlowCard key={i} glow={i % 2 === 1 ? "cyan" : "violet"} padding="p-8">
                  <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-text-muted leading-relaxed">{card.desc}</p>
                </GlowCard>
              )
            })}
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Stats ─────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal className="grid grid-cols-2 md:grid-cols-4 gap-4" stagger={0.1}>
            {stats.map((s, i) => (
              <div
                key={i}
                className={`bg-card border border-border rounded-2xl p-6 text-center border-t-2 ${
                  i % 2 === 0 ? "border-t-accent" : "border-t-accent-secondary"
                } card-glow-border`}
              >
                <div className={`text-3xl font-bold font-display mb-2 ${s.color}`}>{s.value}</div>
                <div className="text-sm text-text-muted">{s.label}</div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Commands Preview ───────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <SectionHeading
              title={t("home.commandExample.title")}
              subtitle={t("home.commandExample.subtitle")}
              badge="Commands"
              align="center"
            />
          </ScrollReveal>

          <ScrollReveal y={24}>
            <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl overflow-hidden shadow-2xl shadow-accent/5 card-glow-border">
              {/* Terminal chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5 bg-elevated border-b border-border">
                <span className="w-3 h-3 rounded-full bg-red-400/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <span className="w-3 h-3 rounded-full bg-green-400/80" />
                <div className="ml-3 flex items-center gap-1.5 text-xs text-text-muted font-mono">
                  <Terminal className="h-3 w-3" />
                  nightclaw — commands
                </div>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Column 1 */}
                  <div>
                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-4">
                      {t("home.commandExample.commandCard.titleOne")}
                    </p>
                    <div className="space-y-2">
                      {cmdFirst.map((c, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 px-4 py-3 bg-background rounded-xl border border-border hover:border-accent/30 hover:bg-elevated transition-all group"
                        >
                          <span className="font-mono text-xs text-accent/40 select-none">&gt;</span>
                          <span className="font-mono text-sm text-accent font-semibold">{c.cmd}</span>
                          <span className="text-text-muted text-xs ml-auto text-right opacity-0 group-hover:opacity-100 transition-opacity">{c.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div>
                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-4">
                      {t("home.commandExample.commandCard.titleTwo")}
                    </p>
                    <div className="space-y-2">
                      {cmdSecond.map((c, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 px-4 py-3 bg-background rounded-xl border border-border hover:border-accent-secondary/30 hover:bg-elevated transition-all group"
                        >
                          <span className="font-mono text-xs text-accent-secondary/40 select-none">&gt;</span>
                          <span className="font-mono text-sm text-accent-secondary font-semibold">{c.cmd}</span>
                          <span className="text-text-muted text-xs ml-auto text-right opacity-0 group-hover:opacity-100 transition-opacity">{c.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8 pt-6 border-t border-border">
                  <Link href="/guide">
                    <Button variant="outline" className="group">
                      {t("home.commandExample.commandCard.guideCta")}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────── */}
      <section className="hero-glow py-28 relative">
        <div className="absolute inset-0 bg-dot-grid opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal y={20}>
            <GlowCard
              className="max-w-3xl mx-auto text-center"
              glow="violet"
              padding="p-12 md:p-16"
              hover={false}
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <CheckCircle2 className="h-5 w-5 text-accent-secondary" />
                <span className="text-sm text-text-muted">Free to use · No setup fees · 24/7</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-5">
                {t("home.footerSection.title")}
              </h2>
              <p className="text-lg text-text-muted mb-10 max-w-xl mx-auto">
                {t("home.footerSection.subtitle")}
              </p>
              <Link href={BOT_INVITE_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="shadow-xl shadow-accent/30 group">
                  {t("home.footerSection.ctaPrimary")}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-xs text-text-muted mt-6 opacity-60">
                {t("home.footerSection.smallLines")}
              </p>
            </GlowCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
