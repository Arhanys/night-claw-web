import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { fetchDiscordUsers } from "@/lib/discord"
import { getScopedI18n } from "@/locales/server"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AppealsList } from "./AppealsList"
import type { AppealRecord } from "./AppealsList"

const PAGE_SIZE = 20
const VALID_STATUSES = ["open", "accepted", "refused"] as const
type AppealStatus = (typeof VALID_STATUSES)[number]

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

  const [rawAppeals, total] = await Promise.all([
    prisma.ban_appeals.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (pageNum - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.ban_appeals.count({ where }),
  ])

  const allIds = [
    ...rawAppeals.map((a) => a.user_id),
    ...rawAppeals.filter((a) => a.reviewed_by).map((a) => a.reviewed_by!),
  ]
  const usersMap = await fetchDiscordUsers(allIds)
  const users = Object.fromEntries(usersMap)

  const appeals: AppealRecord[] = rawAppeals.map((a) => ({
    id: a.id,
    user_id: a.user_id,
    source_guild_id: a.source_guild_id,
    appeal_reason: a.appeal_reason,
    ban_reason: a.ban_reason,
    status: a.status,
    reviewed_by: a.reviewed_by,
    decision_reason: a.decision_reason,
    created_at: a.created_at?.toISOString() ?? null,
  }))

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const buildHref = (p: number, s?: string) => {
    const q = new URLSearchParams()
    if (p > 1) q.set("page", String(p))
    if (s) q.set("status", s)
    const qs = q.toString()
    return `/${locale}/dashboard/${guildId}/appeals${qs ? `?${qs}` : ""}`
  }

  const strings = {
    status: t("appeals.status"),
    appellant: t("appeals.appellant"),
    appealReason: t("appeals.appealReason"),
    banReason: t("appeals.banReason"),
    reviewedBy: t("appeals.reviewedBy"),
    date: t("appeals.date"),
    noReason: t("appeals.noReason"),
    notReviewed: t("appeals.notReviewed"),
    discordId: t("appeals.discordId"),
    noResults: t("appeals.noResults"),
    previous: t("appeals.previous"),
    next: t("appeals.next"),
    page: t("appeals.page"),
    of: t("appeals.of"),
    total: t("appeals.total"),
    statuses: {
      open:     t("appeals.statuses.open"),
      accepted: t("appeals.statuses.accepted"),
      refused:  t("appeals.statuses.refused"),
    },
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl">
      {/* Back */}
      <Link
        href={`/${locale}/dashboard/${guildId}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-text/70 hover:text-text hover:bg-elevated transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t("appeals.backToOverview")}
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("appeals.title")}</h1>
          <p className="text-sm text-text-muted mt-1">
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
                ? "bg-accent/15 text-accent border border-accent/30"
                : "bg-elevated border border-border text-text-muted hover:text-text hover:border-accent/20"
            }`}
          >
            {t("appeals.all")}
          </Link>
          {VALID_STATUSES.map((s) => (
            <Link
              key={s}
              href={buildHref(1, s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === s
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "bg-elevated border border-border text-text-muted hover:text-text hover:border-accent/20"
              }`}
            >
              {t(`appeals.statuses.${s}` as any)}
            </Link>
          ))}
        </div>
      </div>

      <AppealsList
        appeals={appeals}
        users={users}
        strings={strings}
        timeLocale={locale === "fr" ? "fr-FR" : "en-US"}
        pageNum={pageNum}
        totalPages={totalPages}
        total={total}
        prevHref={pageNum > 1 ? buildHref(pageNum - 1, statusFilter) : null}
        nextHref={pageNum < totalPages ? buildHref(pageNum + 1, statusFilter) : null}
      />
    </div>
  )
}
