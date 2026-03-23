import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { fetchDiscordUsers, DiscordUser } from "@/lib/discord"
import { getScopedI18n } from "@/locales/server"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronLeft, ChevronRight, Info } from "lucide-react"

const PAGE_SIZE = 20
const VALID_ACTIONS = ["ban", "kick", "mute", "warn"] as const
type ActionType = (typeof VALID_ACTIONS)[number]

const ACTION_STYLE: Record<ActionType, { pill: string; dot: string; label: string }> = {
  ban:  { pill: "bg-red-500/12 text-red-400 ring-1 ring-red-500/20",       dot: "bg-red-400",    label: "Ban" },
  kick: { pill: "bg-orange-500/12 text-orange-400 ring-1 ring-orange-500/20", dot: "bg-orange-400", label: "Kick" },
  mute: { pill: "bg-yellow-500/12 text-yellow-400 ring-1 ring-yellow-500/20", dot: "bg-yellow-400", label: "Mute" },
  warn: { pill: "bg-blue-500/12 text-blue-400 ring-1 ring-blue-500/20",    dot: "bg-blue-400",   label: "Warn" },
}

function UserCell({ userId, user, discordIdLabel }: { userId: string; user: DiscordUser | null; discordIdLabel: string }) {
  const displayName = user?.globalName ?? user?.username ?? null
  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp?size=32`
    : null
  const initials = (displayName ?? userId)[0]?.toUpperCase() ?? "?"

  return (
    <div className="flex items-center gap-2.5 min-w-0">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={displayName ?? userId}
          width={28}
          height={28}
          className="rounded-full shrink-0"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-text/60 shrink-0">
          {initials}
        </div>
      )}

      <div className="min-w-0">
        {displayName ? (
          <p className="text-sm font-medium truncate">{displayName}</p>
        ) : (
          <p className="text-sm font-mono text-text/50 truncate">{userId}</p>
        )}
        {displayName && (
          <p className="text-[11px] text-text/35 font-mono truncate">@{user?.username}</p>
        )}
      </div>

      <div className="relative group/id shrink-0 ml-auto">
        <Info className="h-3.5 w-3.5 text-text/25 cursor-help hover:text-text/50 transition-colors" />
        <div className="absolute right-0 bottom-full mb-2 hidden group-hover/id:flex flex-col items-start bg-card border border-border/50 rounded-xl px-3 py-2 shadow-2xl z-50 pointer-events-none min-w-max">
          <span className="text-[10px] text-text/40 uppercase tracking-wide font-semibold mb-1">{discordIdLabel}</span>
          <span className="text-xs font-mono text-text/80">{userId}</span>
          <div className="absolute right-2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border/50" />
        </div>
      </div>
    </div>
  )
}

export default async function SanctionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; guildId: string }>
  searchParams: Promise<{ page?: string; action?: string }>
}) {
  const { locale, guildId } = await params
  const { page = "1", action } = await searchParams

  const session = await auth()
  if (!session?.accessibleGuildIds.includes(guildId)) redirect(`/${locale}/dashboard`)

  const t = await getScopedI18n("dashboard")

  const pageNum = Math.max(1, parseInt(page, 10) || 1)
  const actionFilter =
    action && (VALID_ACTIONS as readonly string[]).includes(action) ? action : undefined

  const where = {
    guild_id: guildId,
    ...(actionFilter ? { action: actionFilter } : {}),
  }

  const [logs, total] = await Promise.all([
    prisma.mod_logs.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (pageNum - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.mod_logs.count({ where }),
  ])

  const allIds = logs.flatMap((l) => [l.target_id, l.moderator_id])
  const users = await fetchDiscordUsers(allIds)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const buildHref = (p: number, a?: string) => {
    const q = new URLSearchParams()
    if (p > 1) q.set("page", String(p))
    if (a) q.set("action", a)
    const qs = q.toString()
    return `/${locale}/dashboard/${guildId}/sanctions${qs ? `?${qs}` : ""}`
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Back */}
      <Link
        href={`/${locale}/dashboard/${guildId}`}
        className="inline-flex items-center gap-1.5 text-sm text-text/50 hover:text-text/80 transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t("sanctions.backToOverview")}
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("sanctions.title")}</h1>
          <p className="text-sm text-text/50 mt-1">
            {total.toLocaleString()} {total !== 1 ? t("sanctions.actions") : t("sanctions.action")}
            {actionFilter ? ` · ${actionFilter}s ${t("sanctions.filterOnly")}` : ""}
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            href={buildHref(1)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              !actionFilter
                ? "bg-accent text-white"
                : "bg-card border border-border/50 text-text/60 hover:text-text"
            }`}
          >
            {t("sanctions.all")}
          </Link>
          {VALID_ACTIONS.map((a) => {
            const s = ACTION_STYLE[a]
            return (
              <Link
                key={a}
                href={buildHref(1, a)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                  actionFilter === a
                    ? "bg-accent text-white"
                    : "bg-card border border-border/50 text-text/60 hover:text-text"
                }`}
              >
                {s.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        {logs.length === 0 ? (
          <div className="py-20 text-center text-text/40 text-sm">
            {t("sanctions.noResults")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{t("sanctions.action")}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{t("sanctions.target")}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{t("sanctions.moderator")}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{t("sanctions.date")}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{t("sanctions.reason")}</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => {
                  const style = ACTION_STYLE[log.action as ActionType]
                  const isLast = i === logs.length - 1
                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-white/[0.025] transition-colors ${!isLast ? "border-b border-border/30" : ""}`}
                    >
                      <td className="px-5 py-4 w-28">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            style?.pill ?? "bg-white/10 text-text/60"
                          }`}
                        >
                          {style && (
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                          )}
                          {style?.label ?? log.action}
                        </span>
                      </td>

                      <td className="px-5 py-4 w-52">
                        <UserCell userId={log.target_id} user={users.get(log.target_id) ?? null} discordIdLabel={t("sanctions.discordId")} />
                      </td>

                      <td className="px-5 py-4 w-52">
                        <UserCell userId={log.moderator_id} user={users.get(log.moderator_id) ?? null} discordIdLabel={t("sanctions.discordId")} />
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-sm text-text/70">
                          {log.created_at?.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }) ?? "—"}
                        </div>
                        {log.created_at && (
                          <div className="text-[11px] text-text/35 mt-0.5">
                            {log.created_at.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4 max-w-xs">
                        {log.reason ? (
                          <span className="text-sm text-text/70 line-clamp-2">{log.reason}</span>
                        ) : (
                          <span className="text-sm text-text/25 italic">{t("sanctions.noReason")}</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-sm text-text/40">
            {t("sanctions.page")} {pageNum} {t("sanctions.of")} {totalPages} · {total.toLocaleString()} {t("sanctions.total")}
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={pageNum > 1 ? buildHref(pageNum - 1, actionFilter) : "#"}
              aria-disabled={pageNum <= 1}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-colors ${
                pageNum <= 1
                  ? "border-border/20 text-text/20 cursor-not-allowed"
                  : "border-border/50 hover:bg-white/5 text-text/70 hover:text-text"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("sanctions.previous")}
            </Link>
            <Link
              href={pageNum < totalPages ? buildHref(pageNum + 1, actionFilter) : "#"}
              aria-disabled={pageNum >= totalPages}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-colors ${
                pageNum >= totalPages
                  ? "border-border/20 text-text/20 cursor-not-allowed"
                  : "border-border/50 hover:bg-white/5 text-text/70 hover:text-text"
              }`}
            >
              {t("sanctions.next")}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
