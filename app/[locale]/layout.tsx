import type { Metadata } from "next"
import "./globals.css"
import { Syne, DM_Sans } from "next/font/google"
import { Providers } from "./providers"
import GSAPProvider from "@/components/wrappers/GSAPProvider"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nightclaw.xyz"

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const fr = locale === "fr"

  const title = fr
    ? "NightClaw — Bot de modération Discord"
    : "NightClaw — Discord Moderation Bot"
  const description = fr
    ? "NightClaw est un bot Discord de modération complet : bannissements, kicks, mutes, avertissements, appels de sanctions et tableau de bord web. Gratuit."
    : "NightClaw is a free Discord moderation bot with ban/kick/mute/warn commands, ban appeals, mod logs, ticket system, and a full web dashboard."

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: "%s | NightClaw",
    },
    description,
    keywords: fr
      ? ["bot discord modération", "bot modération discord", "appel bannissement discord", "modération serveur discord", "ban appeals discord", "nightclaw"]
      : ["discord moderation bot", "discord bot", "ban appeals discord", "discord mod bot", "discord server moderation", "kick mute ban discord", "nightclaw bot"],
    openGraph: {
      type: "website",
      locale: fr ? "fr_FR" : "en_US",
      siteName: "NightClaw",
      title,
      description,
      url: `${SITE_URL}/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        "en": `${SITE_URL}/en`,
        "fr": `${SITE_URL}/fr`,
      },
    },
    robots: { index: true, follow: true },
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} font-sans bg-background text-text antialiased`}>
        <GSAPProvider />
        <Providers locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
