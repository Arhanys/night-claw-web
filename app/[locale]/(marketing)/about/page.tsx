import type { Metadata } from "next"
import { getI18n } from "@/locales/server"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nightclaw.xyz"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const fr = locale === "fr"
  const title = fr ? "À propos de NightClaw" : "About NightClaw"
  const description = fr
    ? "Découvrez NightClaw, le bot de modération Discord pensé pour les modérateurs. Notre mission : rendre la modération simple, puissante et accessible."
    : "Learn about NightClaw, the Discord moderation bot built for server moderators. Our mission: make moderation simple, powerful, and accessible."
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/about`,
      languages: { en: `${SITE_URL}/en/about`, fr: `${SITE_URL}/fr/about` },
    },
    openGraph: { title, description, url: `${SITE_URL}/${locale}/about` },
    twitter: { title, description },
  }
}
import Link from "next/link"
import { Button } from "@/components/ui/button"
import GlowCard from "@/components/ui/GlowCard"
import ScrollReveal from "@/components/marketing/ScrollReveal"
import { Rocket, Zap, Wrench, ArrowRight } from "lucide-react"
import { BOT_INVITE_URL } from "@/lib/constants"

const reasonIcons = [Rocket, Zap, Wrench]

export default async function About() {
  const t = await getI18n()

  return (
    <div className="min-h-screen bg-background">

      {/* ─── Page header ────────────────────────────────── */}
      <div className="section-glow-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-[0.03] pointer-events-none" />
        <div className="container mx-auto px-6 pt-24 pb-28 text-center relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-5 bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/25">
            About
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight">
            {t("about.title")}
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            {t("about.subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-4xl space-y-20">

        {/* ─── Section One ────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-accent rounded-full" />
            <h2 className="text-3xl font-bold">{t("about.sectionOne.title")}</h2>
          </div>

          <GlowCard glow="violet" padding="p-8" hover={false}>
            <p className="text-text-muted leading-relaxed mb-7 text-[15px]">
              {t("about.sectionOne.content.paragraphOne")}
            </p>

            {/* Problem box */}
            <div className="relative bg-accent/8 border-l-2 border-accent rounded-r-xl p-6 mb-7">
              <p className="font-semibold text-text mb-1.5">
                {t("about.sectionOne.content.problemBox.title")}
              </p>
              <p className="text-text-muted text-[14px] leading-relaxed">
                {t("about.sectionOne.content.problemBox.content")}
              </p>
            </div>

            <p className="text-text-muted leading-relaxed text-[15px]">
              {t("about.sectionOne.content.paragraphTwo.partOne")}{" "}
              <span className="text-accent font-semibold">
                {t("about.sectionOne.content.paragraphTwo.highlight")}
              </span>{" "}
              {t("about.sectionOne.content.paragraphTwo.partTwo")}
            </p>
          </GlowCard>
        </section>

        {/* ─── Section Two ────────────────────────────── */}
        <section>
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-accent-secondary rounded-full" />
              <h2 className="text-3xl font-bold">{t("about.sectionTwo.title")}</h2>
            </div>
          </ScrollReveal>

          <ScrollReveal className="grid md:grid-cols-2 gap-6" stagger={0.15}>
            <GlowCard glow="violet" padding="p-7">
              {/* Dev avatar */}
              <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent font-bold flex items-center justify-center text-xl mb-5">
                A
              </div>
              <h3 className="text-xl font-bold mb-3">{t("about.sectionTwo.cardOne.title")}</h3>
              <p className="text-text-muted leading-relaxed mb-5 text-[14px]">
                {t("about.sectionTwo.cardOne.content")}
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1.5 bg-accent/12 text-accent border border-accent/25 rounded-lg text-xs font-semibold">
                  {t("about.sectionTwo.cardOne.badgeOne")}
                </span>
                <span className="px-3 py-1.5 bg-accent-secondary/12 text-accent-secondary border border-accent-secondary/25 rounded-lg text-xs font-semibold">
                  {t("about.sectionTwo.cardOne.badgeTwo")}
                </span>
              </div>
            </GlowCard>

            <GlowCard glow="cyan" padding="p-7">
              <div className="w-12 h-12 rounded-2xl bg-accent-secondary/15 text-accent-secondary font-bold flex items-center justify-center text-xl mb-5">
                🎯
              </div>
              <h3 className="text-xl font-bold mb-3">{t("about.sectionTwo.cardTwo.title")}</h3>
              <p className="text-text-muted leading-relaxed mb-4 text-[14px]">
                {t("about.sectionTwo.cardTwo.content")}
              </p>
              <p className="text-text-muted text-[13px] italic border-l-2 border-accent-secondary/30 pl-3">
                {t("about.sectionTwo.cardTwo.suggestion")}
              </p>
            </GlowCard>
          </ScrollReveal>
        </section>

        {/* ─── Section Three ──────────────────────────── */}
        <ScrollReveal>
          <section>
            <GlowCard glow="violet" padding="p-10" hover={false}>
              <h3 className="text-2xl font-bold text-center mb-6">
                {t("about.sectionThree.title")}
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { key: "reasonOne", color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
                  { key: "reasonTwo", color: "text-accent-secondary", bg: "bg-accent-secondary/10", border: "border-accent-secondary/20" },
                  { key: "reasonThree", color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
                ].map(({ key, color, bg, border }, i) => {
                  const Icon = reasonIcons[i]
                  return (
                    <div key={key} className="text-center">
                      <div className={`w-12 h-12 ${bg} border ${border} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <Icon className={`h-6 w-6 ${color}`} />
                      </div>
                      <h4 className="font-bold mb-2">
                        {(t as any)(`about.sectionThree.${key}.title`)}
                      </h4>
                      <p className="text-text-muted text-sm leading-relaxed">
                        {(t as any)(`about.sectionThree.${key}.content`)}
                      </p>
                    </div>
                  )
                })}
              </div>
            </GlowCard>
          </section>
        </ScrollReveal>

        {/* ─── Footer CTA ─────────────────────────────── */}
        <ScrollReveal>
          <GlowCard glow="cyan" className="text-center" padding="p-10" hover={false}>
            <h3 className="text-2xl font-bold mb-4">{t("about.footer.title")}</h3>
            <p className="text-text-muted mb-8 max-w-xl mx-auto leading-relaxed">
              {t("about.footer.content")}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href={BOT_INVITE_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="group shadow-xl shadow-accent/25">
                  {t("about.footer.ctaOne")}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg">
                {t("about.footer.ctaTwo")}
              </Button>
            </div>
          </GlowCard>
        </ScrollReveal>

      </div>
    </div>
  )
}
