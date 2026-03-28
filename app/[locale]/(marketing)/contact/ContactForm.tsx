"use client"

import { useActionState } from "react"
import { sendContactEmail, type ContactState } from "./actions"
import { Button } from "@/components/ui/button"
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

const initial: ContactState = { status: "idle" }

export function ContactForm({ strings }: { strings: {
  name: string
  namePlaceholder: string
  email: string
  emailPlaceholder: string
  subject: string
  subjectPlaceholder: string
  message: string
  messagePlaceholder: string
  send: string
  successTitle: string
  successDesc: string
  errorTitle: string
}}) {
  const [state, action, pending] = useActionState(sendContactEmail, initial)

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-accent-secondary/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-accent-secondary" />
        </div>
        <h2 className="text-2xl font-bold">{strings.successTitle}</h2>
        <p className="text-text-muted max-w-sm">{strings.successDesc}</p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-5">
      {state.status === "error" && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.message ?? strings.errorTitle}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold mb-1.5">{strings.name}</label>
          <input
            name="name"
            type="text"
            required
            placeholder={strings.namePlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-elevated text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 placeholder:text-text-muted/40 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">{strings.email}</label>
          <input
            name="email"
            type="email"
            required
            placeholder={strings.emailPlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-elevated text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 placeholder:text-text-muted/40 transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5">{strings.subject}</label>
        <input
          name="subject"
          type="text"
          required
          placeholder={strings.subjectPlaceholder}
          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-elevated text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 placeholder:text-text-muted/40 transition"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5">{strings.message}</label>
        <textarea
          name="message"
          required
          rows={6}
          placeholder={strings.messagePlaceholder}
          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-elevated text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 placeholder:text-text-muted/40 resize-none transition"
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full gap-2">
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {strings.send}
      </Button>
    </form>
  )
}
