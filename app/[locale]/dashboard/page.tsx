import { auth, update } from "@/lib/auth"
import { redirect } from "next/navigation"
import { fetchGuildBasic } from "@/lib/discord"
import { getScopedI18n } from "@/locales/server"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, RefreshCw, Server } from "lucide-react"

function iconUrl(guildId: string, icon: string) {
  return `https://cdn.discordapp.com/icons/${guildId}/${icon}.webp?size=128`
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()
  if (!session) redirect("/api/auth/signin")

  async function refreshAccess() {
    "use server"
    await update({})
    redirect(`/${locale}/dashboard`)
  }

  const t = await getScopedI18n("dashboard")

  const guilds = (
    await Promise.all(session.accessibleGuildIds.map((id) => fetchGuildBasic(id)))
  ).filter((g): g is NonNullable<typeof g> => g !== null)

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t("selectServer.title")}</h1>
          <p className="text-sm text-text-muted">
            {t("selectServer.subtitleOne")} {guilds.length}{" "}
            {guilds.length !== 1 ? t("selectServer.servers") : t("selectServer.server")}.
          </p>
        </div>
        <form action={refreshAccess}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-elevated hover:border-accent/30"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {t("selectServer.refresh")}
          </button>
        </form>
      </div>

      {guilds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Server className="h-12 w-12 text-text-muted mb-4" />
          <p className="font-medium text-text-muted">{t("selectServer.noServers")}</p>
          <p className="text-sm text-text-muted/60 mt-1">{t("selectServer.noServersHint")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guilds.map((guild) => (
            <Link
              key={guild.id}
              href={`/${locale}/dashboard/${guild.id}`}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:bg-elevated hover:border-accent/30 transition-all duration-200"
            >
              {guild.icon ? (
                <Image
                  src={iconUrl(guild.id, guild.icon)}
                  alt={guild.name}
                  width={48}
                  height={48}
                  className="rounded-2xl shrink-0 ring-1 ring-border"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-lg font-bold shrink-0">
                  {guild.name[0]}
                </div>
              )}
              <span className="font-semibold flex-1 truncate">{guild.name}</span>
              <ChevronRight className="h-4 w-4 text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
