import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { fetchGuildBasic } from "@/lib/discord"
import { getScopedI18n } from "@/locales/server"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Server } from "lucide-react"

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

  const t = await getScopedI18n("dashboard")

  const guilds = (
    await Promise.all(session.accessibleGuildIds.map((id) => fetchGuildBasic(id)))
  ).filter((g): g is NonNullable<typeof g> => g !== null)

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">{t("selectServer.title")}</h1>
        <p className="text-sm text-text/50">
          {t("selectServer.subtitleOne")} {guilds.length}{" "}
          {guilds.length !== 1 ? t("selectServer.servers") : t("selectServer.server")}.
        </p>
      </div>

      {guilds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Server className="h-12 w-12 text-text/20 mb-4" />
          <p className="font-medium text-text/60">{t("selectServer.noServers")}</p>
          <p className="text-sm text-text/40 mt-1">{t("selectServer.noServersHint")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guilds.map((guild) => (
            <Link
              key={guild.id}
              href={`/${locale}/dashboard/${guild.id}`}
              className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card hover:border-accent/40 hover:bg-accent/5 transition-all"
            >
              {guild.icon ? (
                <Image
                  src={iconUrl(guild.id, guild.icon)}
                  alt={guild.name}
                  width={48}
                  height={48}
                  className="rounded-2xl shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-lg font-bold shrink-0">
                  {guild.name[0]}
                </div>
              )}
              <span className="font-semibold flex-1 truncate">{guild.name}</span>
              <ChevronRight className="h-4 w-4 text-text/30 group-hover:text-accent/60 transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
