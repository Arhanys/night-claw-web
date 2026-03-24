import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { fetchDiscordUsers } from "@/lib/discord"
import { getScopedI18n } from "@/locales/server"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SanctionsList, ResolvedLog } from "./SanctionsList"

const PAGE_SIZE = 20
const VALID_ACTIONS = ["ban", "kick", "mute", "warn"] as const

interface ModLog {
  id: number
  action: string
  target_id: string
  moderator_id: string
  reason: string | null
  created_at: Date | null
  guild_id: string | null
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

  const isAdmin = session.adminGuildIds.includes(guildId)
  const t = await getScopedI18n("dashboard")

  const pageNum = Math.max(1, parseInt(page, 10) || 1)
  const actionFilter =
    action && (VALID_ACTIONS as readonly string[]).includes(action) ? action : undefined

  const where = {
    guild_id: guildId,
    ...(actionFilter ? { action: actionFilter } : {}),
  }

  const [logs, total]: [ModLog[], number] = await Promise.all([
    prisma.mod_logs.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (pageNum - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }) as Promise<ModLog[]>,
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

  const resolvedLogs: ResolvedLog[] = logs.map((log) => ({
    id: log.id,
    action: log.action,
    target_id: log.target_id,
    moderator_id: log.moderator_id,
    reason: log.reason,
    created_at: log.created_at?.toISOString() ?? null,
    target: users.get(log.target_id) ?? null,
    mod: users.get(log.moderator_id) ?? null,
  }))

  const strings = {
    action: t("sanctions.action"),
    target: t("sanctions.target"),
    moderator: t("sanctions.moderator"),
    date: t("sanctions.date"),
    reason: t("sanctions.reason"),
    noReason: t("sanctions.noReason"),
    discordId: t("sanctions.discordId"),
    noResults: t("sanctions.noResults"),
    previous: t("sanctions.previous"),
    next: t("sanctions.next"),
    page: t("sanctions.page"),
    of: t("sanctions.of"),
    total: t("sanctions.total"),
    details: t("sanctions.details"),
    editReason: t("sanctions.editReason"),
    saveReason: t("sanctions.saveReason"),
    deleteTitle: t("sanctions.deleteTitle"),
    deleteConfirm: t("sanctions.deleteConfirm"),
    saved: t("sanctions.saved"),
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl">
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
                : "bg-white/5 text-text/60 hover:text-text"
            }`}
          >
            {t("sanctions.all")}
          </Link>
          {VALID_ACTIONS.map((a) => (
            <Link
              key={a}
              href={buildHref(1, a)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                actionFilter === a
                  ? "bg-accent text-white"
                  : "bg-white/5 text-text/60 hover:text-text"
              }`}
            >
              {a.charAt(0).toUpperCase() + a.slice(1)}
            </Link>
          ))}
        </div>
      </div>

      <SanctionsList
        initialLogs={resolvedLogs}
        isAdmin={isAdmin}
        guildId={guildId}
        strings={strings}
        pageNum={pageNum}
        totalPages={totalPages}
        total={total}
        prevHref={pageNum > 1 ? buildHref(pageNum - 1, actionFilter) : null}
        nextHref={pageNum < totalPages ? buildHref(pageNum + 1, actionFilter) : null}
      />
    </div>
  )
}
