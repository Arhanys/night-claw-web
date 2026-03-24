import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { fetchDiscordUser, fetchDiscordUsers, DiscordUser } from "@/lib/discord"
import { getScopedI18n } from "@/locales/server"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Search, UserX } from "lucide-react"
import { MemberSanctionsList, MemberLog } from "./MemberSanctionsList"

interface ModLog {
  id: number
  action: string
  target_id: string
  moderator_id: string
  reason: string | null
  created_at: Date | null
  guild_id: string | null
}

interface GroupByResult {
  target_id: string
  _count: { id: number }
}

const ACTION_STYLE: Record<string, { pill: string; dot: string; label: string }> = {
  ban:  { pill: "bg-red-500/12 text-red-400 ring-1 ring-red-500/20",        dot: "bg-red-400",    label: "Ban" },
  kick: { pill: "bg-orange-500/12 text-orange-400 ring-1 ring-orange-500/20", dot: "bg-orange-400", label: "Kick" },
  mute: { pill: "bg-yellow-500/12 text-yellow-400 ring-1 ring-yellow-500/20", dot: "bg-yellow-400", label: "Mute" },
  warn: { pill: "bg-blue-500/12 text-blue-400 ring-1 ring-blue-500/20",     dot: "bg-blue-400",   label: "Warn" },
}

function avatarUrl(userId: string, avatar: string | null) {
  if (!avatar) return null
  return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.webp?size=64`
}

function UserAvatar({ userId, user, size = 32 }: { userId: string; user: DiscordUser | null; size?: number }) {
  const url = user?.avatar ? avatarUrl(userId, user.avatar) : null
  const name = user?.globalName ?? user?.username ?? userId
  const initials = name[0]?.toUpperCase() ?? "?"
  const dim = `w-${size === 40 ? "10" : "8"} h-${size === 40 ? "10" : "8"}`

  if (url) {
    return (
      <Image
        src={url}
        alt={name}
        width={size}
        height={size}
        className="rounded-full shrink-0"
      />
    )
  }
  return (
    <div className={`${dim} rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-text/60 shrink-0`}>
      {initials}
    </div>
  )
}

export default async function MembersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; guildId: string }>
  searchParams: Promise<{ id?: string }>
}) {
  const { locale, guildId } = await params
  const { id: searchId } = await searchParams

  const session = await auth()
  if (!session?.accessibleGuildIds.includes(guildId)) redirect(`/${locale}/dashboard`)

  const isAdmin = session.adminGuildIds.includes(guildId)
  const t = await getScopedI18n("dashboard")

  // ── User profile view ──────────────────────────────────────────────────────
  if (searchId?.trim()) {
    const userId = searchId.trim()
    const [user, sanctions]: [Awaited<ReturnType<typeof fetchDiscordUser>>, ModLog[]] = await Promise.all([
      fetchDiscordUser(userId),
      prisma.mod_logs.findMany({
        where: { guild_id: guildId, target_id: userId },
        orderBy: { created_at: "desc" },
      }) as Promise<ModLog[]>,
    ])

    const moderatorIds = [...new Set(sanctions.map((s) => s.moderator_id))]
    const moderators = await fetchDiscordUsers(moderatorIds)

    const displayName = user?.globalName ?? user?.username ?? null

    const resolvedLogs: MemberLog[] = sanctions.map((s) => ({
      id: s.id,
      action: s.action,
      target_id: s.target_id,
      moderator_id: s.moderator_id,
      reason: s.reason,
      created_at: s.created_at?.toISOString() ?? null,
      mod: moderators.get(s.moderator_id) ?? null,
    }))

    const targetUser = user
      ? { id: userId, username: user.username, globalName: user.globalName ?? null, avatar: user.avatar ?? null }
      : null

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
      edit: t("sanctions.edit"),
      editReason: t("sanctions.editReason"),
      saveReason: t("sanctions.saveReason"),
      cancel: t("sanctions.cancel"),
      deleteTitle: t("sanctions.deleteTitle"),
      deleteConfirm: t("sanctions.deleteConfirm"),
      saved: t("sanctions.saved"),
    }

    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-4xl">
        {/* Back */}
        <Link
          href={`/${locale}/dashboard/${guildId}/members`}
          className="inline-flex items-center gap-1.5 text-sm text-text/50 hover:text-text/80 transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("members.backToSearch")}
        </Link>

        {/* Profile card */}
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-card mb-6">
          {user ? (
            <>
              <UserAvatar userId={userId} user={user} size={40} />
              <div className="min-w-0">
                <p className="font-semibold text-base truncate">
                  {displayName ?? <span className="font-mono text-text/50">{userId}</span>}
                </p>
                {displayName && (
                  <p className="text-xs text-text/40 font-mono">@{user.username}</p>
                )}
                <p className="text-xs text-text/30 font-mono mt-0.5">{userId}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <UserX className="h-5 w-5 text-text/30" />
              </div>
              <div>
                <p className="text-sm font-medium text-text/50">{t("members.notFound")}</p>
                <p className="text-xs font-mono text-text/30">{userId}</p>
              </div>
            </div>
          )}

          <div className="ml-auto text-right shrink-0">
            <p className="text-2xl font-bold tabular-nums">{sanctions.length}</p>
            <p className="text-xs text-text/40">
              {sanctions.length !== 1 ? t("members.sanctions") : t("members.sanction")}
            </p>
          </div>
        </div>

        <MemberSanctionsList
          initialLogs={resolvedLogs}
          isAdmin={isAdmin}
          guildId={guildId}
          targetUser={targetUser}
          strings={strings}
          noSanctionsLabel={t("members.noSanctions")}
          allSanctionsLabel={t("members.allSanctions")}
        />
      </div>
    )
  }

  // ── Search + recently sanctioned list ──────────────────────────────────────
  const recentlySanctioned = await prisma.mod_logs.groupBy({
    by: ["target_id"],
    where: { guild_id: guildId },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 30,
  }) as unknown as GroupByResult[]

  const memberIds = recentlySanctioned.map((r) => r.target_id)
  const memberMap = await fetchDiscordUsers(memberIds)

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{t("members.title")}</h1>
        <p className="text-sm text-text/50">{t("members.subtitle")}</p>
      </div>

      {/* Search form */}
      <form method="GET" className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text/30 pointer-events-none" />
          <input
            name="id"
            type="text"
            placeholder={t("members.searchPlaceholder")}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-text/25 transition"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/80 active:scale-[0.98] transition-all shrink-0"
        >
          {t("members.search")}
        </button>
      </form>

      {/* Recently sanctioned */}
      {recentlySanctioned.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-text/40 uppercase tracking-wide mb-3">
            {t("members.recentlySanctioned")}
          </h2>
          <div className="rounded-2xl bg-card overflow-hidden divide-y divide-white/[0.07]">
            {recentlySanctioned.map((entry) => {
              const user = memberMap.get(entry.target_id) ?? null
              const displayName = user?.globalName ?? user?.username ?? null
              const count = entry._count.id
              return (
                <Link
                  key={entry.target_id}
                  href={`/${locale}/dashboard/${guildId}/members?id=${entry.target_id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.025] transition-colors"
                >
                  <UserAvatar userId={entry.target_id} user={user} size={32} />
                  <div className="min-w-0 flex-1">
                    {displayName ? (
                      <>
                        <p className="text-sm font-medium truncate">{displayName}</p>
                        <p className="text-xs text-text/35 font-mono truncate">@{user?.username}</p>
                      </>
                    ) : (
                      <p className="text-sm font-mono text-text/50 truncate">{entry.target_id}</p>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-text/50 bg-white/5 px-2.5 py-1 rounded-full shrink-0">
                    {count} {count !== 1 ? t("members.sanctions") : t("members.sanction")}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
