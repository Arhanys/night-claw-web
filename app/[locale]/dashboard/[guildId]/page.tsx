import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { fetchGuildStats, fetchGuildModerators, GuildMember } from "@/lib/discord"
import { prisma } from "@/lib/prisma"
import { getScopedI18n } from "@/locales/server"
import Image from "next/image"
import Link from "next/link"
import { Users, Wifi, Shield, Settings } from "lucide-react"

function iconUrl(guildId: string, icon: string) {
  return `https://cdn.discordapp.com/icons/${guildId}/${icon}.webp?size=128`
}

export default async function GuildOverviewPage({
  params,
}: {
  params: Promise<{ locale: string; guildId: string }>
}) {
  const { locale, guildId } = await params
  const session = await auth()
  if (!session?.accessibleGuildIds.includes(guildId)) redirect(`/${locale}/dashboard`)

  const guild = await fetchGuildStats(guildId)
  if (!guild) redirect(`/${locale}/dashboard`)

  const t = await getScopedI18n("dashboard")
  const isAdmin = session.adminGuildIds.includes(guildId)

  const config = await prisma.server_settings.findUnique({
    where: { guild_id: guildId },
    select: { mod_role_id: true },
  })
  const moderators: GuildMember[] = config?.mod_role_id
    ? await fetchGuildModerators(guildId, config.mod_role_id)
    : []

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl">
      {/* Guild header */}
      <div className="flex items-center gap-5 mb-8 pb-8">
        {guild.icon ? (
          <Image
            src={iconUrl(guild.id, guild.icon)}
            alt={guild.name}
            width={72}
            height={72}
            className="rounded-2xl shrink-0"
          />
        ) : (
          <div className="w-[72px] h-[72px] rounded-2xl bg-accent/20 flex items-center justify-center text-3xl font-bold shrink-0">
            {guild.name[0]}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold truncate">{guild.name}</h1>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium mt-1 px-2 py-0.5 rounded-full ${
              isAdmin
                ? "bg-accent/15 text-accent"
                : "bg-white/10 text-text/60"
            }`}
          >
            {isAdmin ? t("overview.administrator") : t("overview.moderator")}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-card">
          <div className="flex items-center gap-2 text-text/50 mb-3">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">{t("overview.members")}</span>
          </div>
          <p className="text-3xl font-bold tabular-nums">
            {guild.approximateMemberCount.toLocaleString()}
          </p>
          <p className="text-sm text-accent-secondary mt-1 font-medium">
            {guild.approximatePresenceCount.toLocaleString()} {t("overview.online")}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-card">
          <div className="flex items-center gap-2 text-text/50 mb-3">
            <Wifi className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">{t("overview.botStatus")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-secondary animate-pulse" />
            <p className="text-lg font-bold text-accent-secondary">{t("overview.botOnline")}</p>
          </div>
          <p className="text-sm text-text/40 mt-1">{t("overview.botActive")}</p>
        </div>

        <div className="p-5 rounded-xl bg-card">
          <div className="flex items-center gap-2 text-text/50 mb-3">
            <Shield className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">{t("overview.yourRole")}</span>
          </div>
          <p className="text-lg font-bold">{isAdmin ? t("overview.admin") : t("overview.mod")}</p>
          <p className="text-sm text-text/40 mt-1">
            {isAdmin ? t("overview.fullAccess") : t("overview.readOnlyAccess")}
          </p>
        </div>
      </div>

      {/* Quick navigation */}
      <h2 className="text-sm font-semibold text-text/40 uppercase tracking-wide mb-3">
        {t("overview.quickAccess")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <Link
          href={`/${locale}/dashboard/${guildId}/sanctions`}
          className="group flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-accent/5 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5 text-red-400" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm">{t("overview.sanctionHistory")}</p>
            <p className="text-xs text-text/40 mt-0.5">{t("overview.sanctionHistoryDesc")}</p>
          </div>
        </Link>

        <Link
          href={`/${locale}/dashboard/${guildId}/config`}
          className="group flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-accent/5 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <Settings className="h-5 w-5 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm">{t("overview.configuration")}</p>
            <p className="text-xs text-text/40 mt-0.5">
              {isAdmin ? t("overview.configDescAdmin") : t("overview.configDescMod")}
            </p>
          </div>
        </Link>
      </div>

      {/* Moderation team */}
      <h2 className="text-sm font-semibold text-text/40 uppercase tracking-wide mb-3">
        {t("overview.modTeam")}
      </h2>
      {moderators.length === 0 ? (
        <p className="text-sm text-text/40">{t("overview.noMods")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {moderators.map((mod) => {
            const displayName = mod.nick ?? mod.globalName ?? mod.username
            const avatarUrl = mod.avatar
              ? `https://cdn.discordapp.com/avatars/${mod.userId}/${mod.avatar}.webp?size=64`
              : null
            return (
              <div
                key={mod.userId}
                className="flex items-center gap-3 p-3 rounded-xl bg-card"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={36}
                    height={36}
                    className="rounded-full shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-text/60 shrink-0">
                    {displayName[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{displayName}</p>
                  <p className="text-[11px] text-text/35 font-mono truncate">@{mod.username}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
