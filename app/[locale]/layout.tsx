import type { Metadata } from "next"
import "./globals.css"
import { Syne, DM_Sans } from "next/font/google"
import { Providers } from "./providers"
import GSAPProvider from "@/components/wrappers/GSAPProvider"

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "NightClaw",
  description: "The most powerful Discord moderation bot, built for moderators.",
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
