import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { fetchDiscordUsers, DiscordUser } from "@/lib/discord"
import { getScopedI18n } from "@/locales/server"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronLeft, ChevronRight, Info } from "lucide-react"

const PAGE_SIZE = 20
const VALID_STATUSES = ["open", "accepted", "refused"] as const
type AppealStatus = (typeof VALID_STATUSES)[number]

interface AppealRecord {
  id: number
  user_id: string
  source_guild_id: string
  appeal_reason: string
  ban_reason: string | null
  status: string | null
  reviewed_by: string | null
  decision_reason: string | null
  created_at: Date | null
}

const STATUS_STYLE: Record<AppealStatus, { pill: string; dot: string }> = {
  open:     { pill: "bg-yellow-500/12 text-yellow-400 ring-1 ring-yellow-500/20", dot: "bg-yellow-400" },
  accepted: { pill: "bg-green-500/12  text-green-400  ring-1 ring-green-500/20",  dot: "bg-green-400"  },
  refused:  { pill: "bg-red-500/12    text-red-400    ring-1 ring-red-500/20",    dot: "bg-red-400"    },
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

export default async function AppealsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; guildId: string }>
  searchParams: Promise<{ page?: string; status?: string }>
}) {
  const { locale, guildId } = await params
  const { page = "1", status } = await searchParams

  const session = await auth()
  if (!session?.accessibleGuildIds.includes(guildId)) redirect(`/${locale}/dashboard`)

  const t = await getScopedI18n("dashboard")

  const pageNum = Math.max(1, parseInt(page, 10) || 1)
  const statusFilter =
    status && (VALID_STATUSES as readonly string[]).includes(status) ? (status as AppealStatus) : undefined

  const where = {
    source_guild_id: guildId,
    ...(statusFilter ? { status: statusFilter } : {}),
  }

  const [appeals, total]: [AppealRecord[], number] = await Promise.all([
    prisma.ban_appeals.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (pageNum - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }) as Promise<AppealRecord[]>,
    prisma.ban_appeals.count({ where }),
  ])

  const allIds = [
    ...appeals.map((a) => a.user_id),
    ...appeals.filter((a) => a.reviewed_by).map((a) => a.reviewed_by!),
  ]
  const users = await fetchDiscordUsers(allIds)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const buildHref = (p: number, s?: string) => {
    const q = new URLSearchParams()
    if (p > 1) q.set("page", String(p))
    if (s) q.set("status", s)
    const qs = q.toString()
    return `/${locale}/dashboard/${guildId}/appeals${qs ? `?${qs}` : ""}`
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Back */}
      <Link
        href={`/${locale}/dashboard/${guildId}`}
        className="inline-flex items-center gap-1.5 text-sm text-text/50 hover:text-text/80 transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t("appeals.backToOverview")}
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("appeals.title")}</h1>
          <p className="text-sm text-text/50 mt-1">
            {total.toLocaleString()} {total !== 1 ? t("sanctions.actions") : t("sanctions.action")}
            {statusFilter ? ` · ${t(`appeals.statuses.${statusFilter}` as any)} ${t("sanctions.filterOnly")}` : ""}
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            href={buildHref(1)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              !statusFilter
                ? "bg-accent text-white"
                : "bg-card border border-border/50 text-text/60 hover:text-text"
            }`}
          >
            {t("appeals.all")}
          </Link>
          {VALID_STATUSES.map((s) => {
            const style = STATUS_STYLE[s]
            return (
              <Link
                key={s}
                href={buildHref(1, s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  statusFilter === s
                    ? "bg-accent text-white"
                    : "bg-card border border-border/50 text-text/60 hover:text-text"
                }`}
              >
                {t(`appeals.statuses.${s}` as any)}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        {appeals.length === 0 ? (
          <div className="py-20 text-center text-text/40 text-sm">
            {t("appeals.noResults")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{t("appeals.status")}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{t("appeals.appellant")}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{t("appeals.appealReason")}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{t("appeals.banReason")}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{t("appeals.reviewedBy")}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{t("appeals.date")}</th>
                </tr>
              </thead>
              <tbody>
                {appeals.map((appeal, i) => {
                  const style = STATUS_STYLE[appeal.status as AppealStatus]
                  const isLast = i === appeals.length - 1
                  return (
                    <tr
                      key={appeal.id}
                      className={`hover:bg-white/[0.025] transition-colors ${!isLast ? "border-b border-border/30" : ""}`}
                    >
                      <td className="px-5 py-4 w-32">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            style?.pill ?? "bg-white/10 text-text/60"
                          }`}
                        >
                          {style && (
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                          )}
                          {t(`appeals.statuses.${appeal.status as AppealStatus}` as any)}
                        </span>
                      </td>

                      <td className="px-5 py-4 w-52">
                        <UserCell userId={appeal.user_id} user={users.get(appeal.user_id) ?? null} discordIdLabel={t("appeals.discordId")} />
                      </td>

                      <td className="px-5 py-4 max-w-[200px]">
                        {appeal.appeal_reason ? (
                          <span className="text-sm text-text/70 line-clamp-2">{appeal.appeal_reason}</span>
                        ) : (
                          <span className="text-sm text-text/25 italic">{t("appeals.noReason")}</span>
                        )}
                      </td>

                      <td className="px-5 py-4 max-w-[200px]">
                        {appeal.ban_reason ? (
                          <span className="text-sm text-text/70 line-clamp-2">{appeal.ban_reason}</span>
                        ) : (
                          <span className="text-sm text-text/25 italic">{t("appeals.noReason")}</span>
                        )}
                      </td>

                      <td className="px-5 py-4 w-52">
                        {appeal.reviewed_by ? (
                          <UserCell userId={appeal.reviewed_by} user={users.get(appeal.reviewed_by) ?? null} discordIdLabel={t("appeals.discordId")} />
                        ) : (
                          <span className="text-sm text-text/25 italic">{t("appeals.notReviewed")}</span>
                        )}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-sm text-text/70">
                          {appeal.created_at?.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }) ?? "—"}
                        </div>
                        {appeal.created_at && (
                          <div className="text-[11px] text-text/35 mt-0.5">
                            {appeal.created_at.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
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
            {t("appeals.page")} {pageNum} {t("appeals.of")} {totalPages} · {total.toLocaleString()} {t("appeals.total")}
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={pageNum > 1 ? buildHref(pageNum - 1, statusFilter) : "#"}
              aria-disabled={pageNum <= 1}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-colors ${
                pageNum <= 1
                  ? "border-border/20 text-text/20 cursor-not-allowed"
                  : "border-border/50 hover:bg-white/5 text-text/70 hover:text-text"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("appeals.previous")}
            </Link>
            <Link
              href={pageNum < totalPages ? buildHref(pageNum + 1, statusFilter) : "#"}
              aria-disabled={pageNum >= totalPages}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-colors ${
                pageNum >= totalPages
                  ? "border-border/20 text-text/20 cursor-not-allowed"
                  : "border-border/50 hover:bg-white/5 text-text/70 hover:text-text"
              }`}
            >
              {t("appeals.next")}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
