import type { Metadata } from "next"
import { getI18n } from "@/locales/server"
import { ContactForm } from "./ContactForm"
import { Mail } from "lucide-react"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nightclaw.xyz"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const fr = locale === "fr"
  const title = fr ? "Nous contacter" : "Contact Us"
  const description = fr
    ? "Une question sur NightClaw ? Contactez-nous directement via ce formulaire."
    : "Have a question about NightClaw? Reach out to us directly via this contact form."
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/contact`,
      languages: { en: `${SITE_URL}/en/contact`, fr: `${SITE_URL}/fr/contact` },
    },
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getI18n()
  const fr = locale === "fr"

  const strings = {
    name:               fr ? "Nom"               : "Name",
    namePlaceholder:    fr ? "Votre nom"          : "Your name",
    email:              fr ? "E-mail"             : "Email",
    emailPlaceholder:   fr ? "votre@email.com"    : "you@example.com",
    subject:            fr ? "Sujet"              : "Subject",
    subjectPlaceholder: fr ? "De quoi s'agit-il ?" : "What's this about?",
    message:            fr ? "Message"            : "Message",
    messagePlaceholder: fr ? "Votre message…"     : "Your message…",
    send:               fr ? "Envoyer"            : "Send message",
    successTitle:       fr ? "Message envoyé !"   : "Message sent!",
    successDesc:        fr
      ? "Merci de nous avoir contactés. Nous reviendrons vers vous dès que possible."
      : "Thanks for reaching out. We'll get back to you as soon as possible.",
    errorTitle:         fr ? "Une erreur est survenue." : "Something went wrong.",
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="section-glow-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-[0.03] pointer-events-none" />
        <div className="container mx-auto px-6 pt-24 pb-16 relative z-10 max-w-2xl">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 mb-6">
              <Mail className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {fr ? "Nous contacter" : "Get in touch"}
            </h1>
            <p className="text-text-muted text-lg max-w-md mx-auto">
              {fr
                ? "Une question, un bug, une suggestion ? On vous répond."
                : "A question, a bug, a suggestion? We'll get back to you."}
            </p>
          </div>

          {/* Form card */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 card-glow-border">
            <ContactForm strings={strings} />
          </div>

        </div>
      </div>
    </div>
  )
}
