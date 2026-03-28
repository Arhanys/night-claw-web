import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { fetchGuildStats, fetchGuildModerators, GuildMember } from "@/lib/discord"
import { prisma } from "@/lib/prisma"
import { getScopedI18n } from "@/locales/server"
import Image from "next/image"
import Link from "next/link"
import { Users, Wifi, Shield, Settings, Scale, Ticket, ChevronRight } from "lucide-react"
import type { SanctionByAction, DailyActivity, AppealStatus, TicketStats } from "@/components/dashboard/StatsCharts"
import StatsChartsWrapper from "@/components/dashboard/StatsChartsWrapper"

function iconUrl(guildId: string, icon: string) {
  return `https://cdn.discordapp.com/icons/${guildId}/${icon}.webp?size=128`
}

// Gap-fill missing days with 0
function fillDailyGaps(
  rows: { date: Date | string; count: number }[],
  days = 30
): DailyActivity[] {
  const map = new Map<string, number>()
  for (const r of rows) {
    const key = new Date(r.date).toISOString().slice(0, 10)
    map.set(key, r.count)
  }
  const result: DailyActivity[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - i)
    const key = d.toISOString().slice(0, 10)
    result.push({ date: key, count: map.get(key) ?? 0 })
  }
  return result
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
  const isSuperAdmin = session.isSuperAdmin ?? false

  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [config, rawSanctionsByAction, rawDailyActivity, rawAppealStatuses, ticketTotal, ticketClosed] =
    await Promise.all([
      prisma.server_settings.findUnique({
        where: { guild_id: guildId },
        select: { mod_role_id: true },
      }),
      // Sanctions by action type (last 90 days)
      prisma.mod_logs.groupBy({
        by: ["action"],
        where: { guild_id: guildId, created_at: { gte: ninetyDaysAgo } },
        _count: { id: true },
      }),
      // Daily sanction activity (last 30 days) via raw SQL
      prisma.$queryRaw<{ date: Date; count: bigint }[]>`
        SELECT DATE(created_at) as date, COUNT(*)::int as count
        FROM mod_logs
        WHERE guild_id = ${guildId}
          AND created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date
      `,
      // Appeal status breakdown
      prisma.ban_appeals.groupBy({
        by: ["status"],
        where: { source_guild_id: guildId },
        _count: { id: true },
      }),
      // Ticket stats - total (last 30 days)
      prisma.tickets.count({
        where: { guild_id: guildId, opened_at: { gte: thirtyDaysAgo } },
      }),
      // Ticket stats - closed (last 30 days)
      prisma.tickets.count({
        where: { guild_id: guildId, opened_at: { gte: thirtyDaysAgo }, closed_at: { not: null } },
      }),
    ])

  const moderators: GuildMember[] = config?.mod_role_id
    ? await fetchGuildModerators(guildId, config.mod_role_id)
    : []

  // Serialize chart data (BigInt → Number, Date → string)
  const sanctionsByAction: SanctionByAction[] = rawSanctionsByAction.map((r) => ({
    action: r.action ?? "unknown",
    count: r._count.id,
  }))

  const dailyActivity: DailyActivity[] = fillDailyGaps(
    rawDailyActivity.map((r) => ({ date: r.date, count: Number(r.count) }))
  )

  const appealStatuses: AppealStatus[] = rawAppealStatuses.map((r) => ({
    status: r.status,
    count: r._count.id,
  }))

  const ticketStats: TicketStats = { total: ticketTotal, closed: ticketClosed }

  const chartStrings = {
    sanctionsBreakdown: t("overview.charts.sanctionsBreakdown"),
    sanctionsBreakdownSub: t("overview.charts.sanctionsBreakdownSub"),
    activityTimeline: t("overview.charts.activityTimeline"),
    activityTimelineSub: t("overview.charts.activityTimelineSub"),
    appealStatus: t("overview.charts.appealStatus"),
    allTime: t("overview.charts.allTime"),
    appealStatusLabels: {
      open:     t("appeals.statuses.open"),
      accepted: t("appeals.statuses.accepted"),
      refused:  t("appeals.statuses.refused"),
    },
    ticketResolution: t("overview.charts.ticketResolution"),
    ticketResolutionSub: t("overview.charts.ticketResolutionSub"),
    noData: t("overview.charts.noData"),
    resolved: t("overview.charts.resolved"),
  }

  const quickLinks = [
    {
      href: `/${locale}/dashboard/${guildId}/sanctions`,
      icon: Shield,
      label: t("overview.sanctionHistory"),
      desc: t("overview.sanctionHistoryDesc"),
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      href: `/${locale}/dashboard/${guildId}/appeals`,
      icon: Scale,
      label: t("sidebar.appeals"),
      desc: t("overview.appealsDesc"),
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      href: `/${locale}/dashboard/${guildId}/tickets`,
      icon: Ticket,
      label: t("sidebar.tickets"),
      desc: t("overview.ticketsDesc"),
      color: "text-accent-secondary",
      bg: "bg-accent-secondary/10",
    },
    {
      href: `/${locale}/dashboard/${guildId}/config`,
      icon: Settings,
      label: t("overview.configuration"),
      desc: isAdmin ? t("overview.configDescAdmin") : t("overview.configDescMod"),
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ]

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl">
      {/* Guild header */}
      <div className="flex items-center gap-5 mb-8 pb-8 border-b border-border">
        {guild.icon ? (
          <Image
            src={iconUrl(guild.id, guild.icon)}
            alt={guild.name}
            width={72}
            height={72}
            className="rounded-2xl shrink-0 ring-2 ring-border"
          />
        ) : (
          <div className="w-[72px] h-[72px] rounded-2xl bg-accent/20 flex items-center justify-center text-3xl font-bold shrink-0">
            {guild.name[0]}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold truncate">{guild.name}</h1>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold mt-1.5 px-2.5 py-1 rounded-full ${
              isSuperAdmin
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                : isAdmin
                ? "bg-accent/15 text-accent border border-accent/25"
                : "bg-elevated text-text-muted border border-border"
            }`}
          >
            {isSuperAdmin ? t("overview.superAdmin") : isAdmin ? t("overview.administrator") : t("overview.moderator")}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="dashboard-stat-card p-5 rounded-2xl bg-card border border-border border-l-2 border-l-accent">
          <div className="flex items-center gap-2 text-text-muted mb-3">
            <Users className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">{t("overview.members")}</span>
          </div>
          <p className="text-3xl font-bold tabular-nums font-display">
            {guild.approximateMemberCount.toLocaleString()}
          </p>
          <p className="text-sm text-accent-secondary mt-1.5 font-semibold">
            {guild.approximatePresenceCount.toLocaleString()} {t("overview.online")}
          </p>
        </div>

        <div className="dashboard-stat-card p-5 rounded-2xl bg-card border border-border border-l-2 border-l-accent-secondary">
          <div className="flex items-center gap-2 text-text-muted mb-3">
            <Wifi className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">{t("overview.botStatus")}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-secondary" />
            </span>
            <p className="text-lg font-bold text-accent-secondary">{t("overview.botOnline")}</p>
          </div>
          <p className="text-sm text-text-muted mt-1.5">{t("overview.botActive")}</p>
        </div>

        <div className="dashboard-stat-card p-5 rounded-2xl bg-card border border-border border-l-2 border-l-border">
          <div className="flex items-center gap-2 text-text-muted mb-3">
            <Shield className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">{t("overview.yourRole")}</span>
          </div>
          <p className="text-lg font-bold mt-1">
            {isSuperAdmin ? t("overview.superAdminRole") : isAdmin ? t("overview.admin") : t("overview.mod")}
          </p>
          <p className="text-sm text-text-muted mt-1.5">
            {isSuperAdmin ? t("overview.superAdminAccess") : isAdmin ? t("overview.fullAccess") : t("overview.readOnlyAccess")}
          </p>
        </div>
      </div>

      {/* Charts */}
      <StatsChartsWrapper
        sanctionsByAction={sanctionsByAction}
        dailyActivity={dailyActivity}
        appealStatuses={appealStatuses}
        ticketStats={ticketStats}
        strings={chartStrings}
      />

      {/* Quick navigation */}
      <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
        {t("overview.quickAccess")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {quickLinks.map(({ href, icon: Icon, label, desc, color, bg }) => (
          <Link
            key={href}
            href={href}
            className="dashboard-quick-link group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-accent/30 hover:bg-elevated transition-all duration-200"
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs text-text-muted mt-0.5">{desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
          </Link>
        ))}
      </div>

      {/* Moderation team */}
      <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
        {t("overview.modTeam")}
      </h2>
      {moderators.length === 0 ? (
        <p className="text-sm text-text-muted">{t("overview.noMods")}</p>
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
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:bg-elevated transition-colors"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={36}
                    height={36}
                    className="rounded-full shrink-0 ring-1 ring-border"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-elevated border border-border flex items-center justify-center text-sm font-bold text-text-muted shrink-0">
                    {displayName[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{displayName}</p>
                  <p className="text-[11px] text-text-muted font-mono truncate">@{mod.username}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
