import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getScopedI18n } from "@/locales/server"
import Link from "next/link"
import { ArrowLeft, Lock, Info } from "lucide-react"
import { LanguageToggle } from "./LanguageToggle"

const CONFIG_FIELD_NAMES = [
  "log_channel_id",
  "mod_role_id",
  "language",
  "source_guild_id",
  "appeal_invite_url",
  "main_invite_url",
] as const

type ConfigField = (typeof CONFIG_FIELD_NAMES)[number]

export default async function ConfigPage({
  params,
}: {
  params: Promise<{ locale: string; guildId: string }>
}) {
  const { locale, guildId } = await params
  const session = await auth()
  if (!session?.accessibleGuildIds.includes(guildId)) redirect(`/${locale}/dashboard`)

  const t = await getScopedI18n("dashboard")
  const isAdmin = session.adminGuildIds.includes(guildId)

  const config = await prisma.server_settings.findUnique({
    where: { guild_id: guildId },
  })

  async function saveConfig(formData: FormData) {
    "use server"
    const sess = await auth()
    if (!sess?.adminGuildIds.includes(guildId)) return

    const data: Partial<Record<ConfigField, string | null>> = {}
    for (const name of CONFIG_FIELD_NAMES) {
      const value = formData.get(name)
      data[name] =
        typeof value === "string" && value.trim() !== "" ? value.trim() : null
    }

    await prisma.server_settings.upsert({
      where: { guild_id: guildId },
      update: data,
      create: { guild_id: guildId, ...data },
    })
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl">
      {/* Back */}
      <Link
        href={`/${locale}/dashboard/${guildId}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-text/70 hover:text-text hover:bg-elevated transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t("config.backToOverview")}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">{t("config.title")}</h1>
        {isAdmin ? (
          <p className="text-sm text-text-muted">{t("config.editDesc")}</p>
        ) : (
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Lock className="h-3.5 w-3.5" />
            {t("config.readOnlyDesc")}
          </div>
        )}
      </div>

      {/* Developer Mode tip */}
      <div className="rounded-xl bg-accent/5 border border-accent/20 p-4 flex gap-3 mb-6">
        <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-accent mb-0.5">{t("config.devModeTitle")}</p>
          <p className="text-xs text-text/60">{t("config.devModeDesc")}</p>
        </div>
      </div>

      <form action={isAdmin ? saveConfig : undefined} className="space-y-5">
        {CONFIG_FIELD_NAMES.map((name) => (
          <div key={name} className="rounded-xl bg-card border border-border p-4">
            <label htmlFor={name} className="block text-sm font-semibold mb-0.5">
              {t(`config.fields.${name}.label` as any)}
            </label>
            <p className="text-xs text-text/40 mb-3">{t(`config.fields.${name}.description` as any)}</p>
            {name === "language" ? (
              <LanguageToggle defaultValue={config?.language ?? null} readOnly={!isAdmin} />
            ) : (
              <input
                id={name}
                name={name}
                defaultValue={config?.[name] ?? ""}
                readOnly={!isAdmin}
                placeholder={isAdmin ? t("config.notSet") : "—"}
                className="w-full px-3 py-2 rounded-lg border border-border bg-elevated text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 placeholder:text-text-muted/50 read-only:opacity-60 read-only:cursor-default transition"
              />
            )}
            <p className="text-xs text-text/40 mt-2">{t(`config.fields.${name}.hint` as any)}</p>
          </div>
        ))}

        {isAdmin && (
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/80 active:scale-[0.98] transition-all"
          >
            {t("config.saveChanges")}
          </button>
        )}
      </form>
    </div>
  )
}
