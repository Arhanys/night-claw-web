import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { fetchDiscordUsers } from "@/lib/discord"
import { getScopedI18n } from "@/locales/server"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { TicketsList, ResolvedTicket } from "./TicketsList"

const PAGE_SIZE = 20

interface TicketRecord {
  id: number
  guild_id: string
  channel_id: string
  channel_name: string | null
  user_id: string
  opened_at: Date | null
  closed_at: Date | null
  closed_by: string | null
  transcript_url: string | null
}

export default async function TicketsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; guildId: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale, guildId } = await params
  const { page = "1" } = await searchParams

  const session = await auth()
  if (!session?.accessibleGuildIds.includes(guildId)) redirect(`/${locale}/dashboard`)

  const t = await getScopedI18n("dashboard")

  const pageNum = Math.max(1, parseInt(page, 10) || 1)

  const where = { guild_id: guildId }

  const [tickets, total]: [TicketRecord[], number] = await Promise.all([
    prisma.tickets.findMany({
      where,
      orderBy: { opened_at: "desc" },
      skip: (pageNum - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }) as Promise<TicketRecord[]>,
    prisma.tickets.count({ where }),
  ])

  const allIds = [
    ...tickets.map((t) => t.user_id),
    ...tickets.filter((t) => t.closed_by).map((t) => t.closed_by!),
  ]
  const users = await fetchDiscordUsers(allIds)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const buildHref = (p: number) => {
    const q = new URLSearchParams()
    if (p > 1) q.set("page", String(p))
    const qs = q.toString()
    return `/${locale}/dashboard/${guildId}/tickets${qs ? `?${qs}` : ""}`
  }

  const resolved: ResolvedTicket[] = tickets.map((ticket) => ({
    id: ticket.id,
    channel_id: ticket.channel_id,
    channel_name: ticket.channel_name,
    user_id: ticket.user_id,
    opened_at: ticket.opened_at?.toISOString() ?? null,
    closed_at: ticket.closed_at?.toISOString() ?? null,
    closed_by: ticket.closed_by,
    transcript_url: ticket.transcript_url,
    opener: users.get(ticket.user_id) ?? null,
    closer: ticket.closed_by ? (users.get(ticket.closed_by) ?? null) : null,
  }))

  const strings = {
    noResults: t("tickets.noResults"),
    open: t("tickets.open"),
    closed: t("tickets.closed"),
    channel: t("tickets.channel"),
    opener: t("tickets.opener"),
    closedBy: t("tickets.closedBy"),
    openedAt: t("tickets.openedAt"),
    closedAt: t("tickets.closedAt"),
    discordId: t("tickets.discordId"),
    previous: t("tickets.previous"),
    next: t("tickets.next"),
    page: t("tickets.page"),
    of: t("tickets.of"),
    total: t("tickets.total"),
    noTranscript: t("tickets.noTranscript"),
    viewTranscript: t("tickets.viewTranscript"),
    openInTab: t("tickets.openInTab"),
    transcriptTitle: t("tickets.transcriptTitle"),
    notClosed: t("tickets.notClosed"),
    unknown: t("tickets.unknown"),
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl">
      {/* Back */}
      <Link
        href={`/${locale}/dashboard/${guildId}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t("tickets.backToOverview")}
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("tickets.title")}</h1>
          <p className="text-sm text-text-muted mt-1">
            {total.toLocaleString()} {total !== 1 ? t("tickets.tickets") : t("tickets.ticket")}
          </p>
        </div>
      </div>

      <TicketsList
        tickets={resolved}
        strings={strings}
        pageNum={pageNum}
        totalPages={totalPages}
        total={total}
        prevHref={pageNum > 1 ? buildHref(pageNum - 1) : null}
        nextHref={pageNum < totalPages ? buildHref(pageNum + 1) : null}
      />
    </div>
  )
}
