import type { Metadata } from "next"
import { getI18n, getCurrentLocale } from "@/locales/server"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nightclaw.xyz"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const fr = locale === "fr"
  const title = fr ? "Guide & Commandes" : "Commands & Setup Guide"
  const description = fr
    ? "Guide complet de NightClaw : toutes les commandes /ban, /kick, /mute, /warn, /appeal et la configuration de votre serveur Discord."
    : "Full NightClaw command reference and setup guide. Learn how to use /ban, /kick, /mute, /warn, /appeal and configure your Discord server."
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/guide`,
      languages: { en: `${SITE_URL}/en/guide`, fr: `${SITE_URL}/fr/guide` },
    },
    openGraph: { title, description, url: `${SITE_URL}/${locale}/guide` },
    twitter: { title, description },
  }
}
import Link from "next/link"
import { Button } from "@/components/ui/button"
import GlowCard from "@/components/ui/GlowCard"
import ScrollReveal from "@/components/marketing/ScrollReveal"
import { cn } from "@/lib/utils"

interface CommandProps {
  name: string
  parameters?: { name: string; type: string }[]
  description: string
}

function CommandListItem({ name, parameters = [], description }: CommandProps) {
  return (
    <li className="group relative bg-card border border-border rounded-xl p-5 hover:border-accent/40 hover:bg-elevated transition-all duration-200">
      {/* Left accent bar */}
      <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-accent/25 rounded-full group-hover:bg-accent transition-colors" />

      <div className="pl-4">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h3
            id={name}
            className="font-mono text-base font-bold text-accent"
          >
            /{name}
          </h3>
          {parameters.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {parameters.map((param, index) => (
                <span
                  key={index}
                  className={cn(
                    "px-2 py-0.5 rounded-md text-xs font-mono font-semibold border",
                    param.type === "required"
                      ? "bg-accent/12 text-accent border-accent/25"
                      : "bg-accent-secondary/12 text-accent-secondary border-accent-secondary/25"
                  )}
                >
                  {param.type}: {param.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <p className="text-text-muted text-[14px] leading-relaxed">{description}</p>
      </div>
    </li>
  )
}

function SectionTitle({ accent = "violet", children }: { accent?: "violet" | "cyan"; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-1 h-6 rounded-full ${accent === "violet" ? "bg-accent" : "bg-accent-secondary"}`} />
      <h2 className="text-2xl font-bold">{children}</h2>
    </div>
  )
}

export default async function Guide() {
  const t = await getI18n()
  const locale = await getCurrentLocale()

  const generalCommands: CommandProps[] = [
    { name: t("guide.generalCommands.help.command"), description: t("guide.generalCommands.help.description") },
    {
      name: t("guide.generalCommands.setup.command"),
      parameters: [
        { name: t("guide.generalCommands.setup.badges.badgeOne"), type: t("guide.optional") },
        { name: t("guide.generalCommands.setup.badges.badgeTwo"), type: t("guide.optional") },
        { name: t("guide.generalCommands.setup.badges.badgeThree"), type: t("guide.optional") },
        { name: t("guide.generalCommands.setup.badges.badgeFour"), type: t("guide.optional") },
        { name: t("guide.generalCommands.setup.badges.badgeFive"), type: t("guide.optional") },
        { name: t("guide.generalCommands.setup.badges.badgeSix"), type: t("guide.optional") },
      ],
      description: t("guide.generalCommands.setup.description"),
    },
    { name: t("guide.generalCommands.ticketpanel.command"), description: t("guide.generalCommands.ticketpanel.description") },
    { name: t("guide.generalCommands.confessionsetup.command"), description: t("guide.generalCommands.confessionsetup.description") },
    { name: t("guide.generalCommands.banappealPanel.command"), description: t("guide.generalCommands.banappealPanel.description") },
  ]

  const moderationCommands: CommandProps[] = [
    {
      name: t("guide.moderationCommands.warn.command"),
      parameters: [
        { name: t("guide.moderationCommands.warn.badges.badgeOne"), type: t("guide.required") },
        { name: t("guide.moderationCommands.warn.badges.badgeTwo"), type: t("guide.required") },
      ],
      description: t("guide.moderationCommands.warn.description"),
    },
    {
      name: t("guide.moderationCommands.kick.command"),
      parameters: [
        { name: t("guide.moderationCommands.kick.badges.badgeOne"), type: t("guide.required") },
        { name: t("guide.moderationCommands.kick.badges.badgeTwo"), type: t("guide.required") },
      ],
      description: t("guide.moderationCommands.kick.description"),
    },
    {
      name: t("guide.moderationCommands.mute.command"),
      parameters: [
        { name: t("guide.moderationCommands.mute.badges.badgeOne"), type: t("guide.required") },
        { name: t("guide.moderationCommands.mute.badges.badgeTwo"), type: t("guide.required") },
        { name: t("guide.moderationCommands.mute.badges.badgeThree"), type: t("guide.required") },
      ],
      description: t("guide.moderationCommands.mute.description"),
    },
    {
      name: t("guide.moderationCommands.unmute.command"),
      parameters: [{ name: t("guide.moderationCommands.unmute.badges.badgeOne"), type: t("guide.required") }],
      description: t("guide.moderationCommands.unmute.description"),
    },
    {
      name: t("guide.moderationCommands.clear.command"),
      parameters: [
        { name: t("guide.moderationCommands.clear.badges.badgeOne"), type: t("guide.required") },
        { name: t("guide.moderationCommands.clear.badges.badgeTwo"), type: t("guide.required") },
        { name: t("guide.moderationCommands.clear.badges.badgeThree"), type: t("guide.optional") },
      ],
      description: t("guide.moderationCommands.clear.description"),
    },
    {
      name: t("guide.moderationCommands.ban.command"),
      parameters: [
        { name: t("guide.moderationCommands.ban.badges.badgeOne"), type: t("guide.required") },
        { name: t("guide.moderationCommands.ban.badges.badgeTwo"), type: t("guide.required") },
      ],
      description: t("guide.moderationCommands.ban.description"),
    },
    {
      name: t("guide.moderationCommands.sanction.command"),
      parameters: [{ name: t("guide.moderationCommands.sanction.badges.badgeOne"), type: t("guide.required") }],
      description: t("guide.moderationCommands.sanction.description"),
    },
    {
      name: t("guide.moderationCommands.slowmode.command"),
      parameters: [
        { name: t("guide.moderationCommands.slowmode.badges.badgeOne"), type: t("guide.required") },
        { name: t("guide.moderationCommands.slowmode.badges.badgeTwo"), type: t("guide.optional") },
      ],
      description: t("guide.moderationCommands.slowmode.description"),
    },
  ]

  const appealSteps = [
    { label: t("guide.banAppealSetup.step1.label"), content: t("guide.banAppealSetup.step1.content") },
    { label: t("guide.banAppealSetup.step2.label"), content: t("guide.banAppealSetup.step2.content") },
    { label: t("guide.banAppealSetup.step3.label"), content: t("guide.banAppealSetup.step3.content") },
  ]

  return (
    <div id="top" className="min-h-screen bg-background">

      {/* ─── Header ─────────────────────────────────────── */}
      <div className="section-glow-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-[0.03] pointer-events-none" />
        <div className="container mx-auto px-6 pt-20 pb-24 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-5 bg-accent/10 text-accent border border-accent/25">
            Documentation
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("guide.title")}</h1>
          <p className="text-lg text-text-muted max-w-2xl">{t("guide.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl space-y-14">

        {/* ─── General Commands ───────────────────────── */}
        <ScrollReveal>
          <section>
            <SectionTitle accent="cyan">{t("guide.generalCommands.title")}</SectionTitle>
            <ul className="space-y-3">
              {generalCommands.map((cmd, i) => <CommandListItem key={i} {...cmd} />)}
            </ul>
          </section>
        </ScrollReveal>

        {/* ─── Moderation Commands ────────────────────── */}
        <ScrollReveal>
          <section>
            <SectionTitle accent="violet">{t("guide.moderationCommands.title")}</SectionTitle>
            <ul className="space-y-3">
              {moderationCommands.map((cmd, i) => <CommandListItem key={i} {...cmd} />)}
            </ul>
          </section>
        </ScrollReveal>

        {/* ─── Ban Appeal Setup ───────────────────────── */}
        <ScrollReveal>
          <section>
            <SectionTitle accent="cyan">{t("guide.banAppealSetup.title")}</SectionTitle>
            <p className="text-text-muted mb-6 leading-relaxed">{t("guide.banAppealSetup.intro")}</p>

            <ol className="space-y-3 mb-6">
              {appealSteps.map((step, i) => (
                <li key={i} className="flex gap-4 bg-card border border-border rounded-xl p-5 hover:border-accent/30 hover:bg-elevated transition-all">
                  <div className="w-7 h-7 rounded-full bg-accent/15 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">{step.label}</p>
                    <p className="text-text-muted text-sm leading-relaxed">{step.content}</p>
                  </div>
                </li>
              ))}
            </ol>

            <GlowCard glow="cyan" padding="p-5" hover={false}>
              <p className="text-sm font-semibold mb-1.5">{t("guide.banAppealSetup.howItWorksTitle")}</p>
              <p className="text-text-muted text-sm leading-relaxed">{t("guide.banAppealSetup.howItWorksContent")}</p>
            </GlowCard>
          </section>
        </ScrollReveal>

        {/* ─── Help ───────────────────────────────────── */}
        <ScrollReveal>
          <GlowCard glow="violet" padding="p-8" hover={false}>
            <h3 className="text-lg font-bold mb-2">{t("guide.help.title")}</h3>
            <p className="text-text-muted mb-5 leading-relaxed">{t("guide.help.text")}</p>
            <div className="flex gap-3 flex-wrap">
              <Button variant="outline" size="sm" asChild>
                <a href="#top">{t("guide.help.button")}</a>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/${locale}/contact`}>{t("guide.help.contactButton")}</Link>
              </Button>
            </div>
          </GlowCard>
        </ScrollReveal>

      </div>
    </div>
  )
}
