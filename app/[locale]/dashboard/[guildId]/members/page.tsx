import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { fetchDiscordUser, fetchDiscordUsers, DiscordUser } from "@/lib/discord"
import { getScopedI18n } from "@/locales/server"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Search, UserX } from "lucide-react"

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

  const t = await getScopedI18n("dashboard")

  // ── User profile view ──────────────────────────────────────────────────────
  if (searchId?.trim()) {
    const userId = searchId.trim()
    const [user, sanctions] = await Promise.all([
      fetchDiscordUser(userId),
      prisma.mod_logs.findMany({
        where: { guild_id: guildId, target_id: userId },
        orderBy: { created_at: "desc" },
      }),
    ])

    const moderatorIds = [...new Set(sanctions.map((s) => s.moderator_id))]
    const moderators = await fetchDiscordUsers(moderatorIds)

    const displayName = user?.globalName ?? user?.username ?? null

    return (
      <div className="p-8 max-w-4xl">
        {/* Back */}
        <Link
          href={`/${locale}/dashboard/${guildId}/members`}
          className="inline-flex items-center gap-1.5 text-sm text-text/50 hover:text-text/80 transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("members.backToSearch")}
        </Link>

        {/* Profile card */}
        <div className="flex items-center gap-4 p-5 rounded-2xl border border-border/50 bg-card mb-6">
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

        {/* Sanctions table */}
        {sanctions.length === 0 ? (
          <div className="rounded-2xl border border-border/50 bg-card py-16 text-center text-text/40 text-sm">
            {t("members.noSanctions")}
          </div>
        ) : (
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border/50">
              <h2 className="text-sm font-semibold text-text/50 uppercase tracking-wide">
                {t("members.allSanctions")}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{t("sanctions.action")}</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{t("sanctions.moderator")}</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{t("sanctions.date")}</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{t("sanctions.reason")}</th>
                  </tr>
                </thead>
                <tbody>
                  {sanctions.map((s, i) => {
                    const style = ACTION_STYLE[s.action]
                    const mod = moderators.get(s.moderator_id) ?? null
                    const modName = mod?.globalName ?? mod?.username ?? null
                    const isLast = i === sanctions.length - 1
                    return (
                      <tr
                        key={s.id}
                        className={`hover:bg-white/[0.025] transition-colors ${!isLast ? "border-b border-border/30" : ""}`}
                      >
                        <td className="px-5 py-3.5 w-28">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style?.pill ?? "bg-white/10 text-text/60"}`}>
                            {style && <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />}
                            {style?.label ?? s.action}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 w-44">
                          <div className="flex items-center gap-2 min-w-0">
                            <UserAvatar userId={s.moderator_id} user={mod} size={32} />
                            <span className="text-sm truncate">
                              {modName ?? <span className="font-mono text-text/40 text-xs">{s.moderator_id}</span>}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="text-sm text-text/70">
                            {s.created_at?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) ?? "—"}
                          </div>
                          {s.created_at && (
                            <div className="text-[11px] text-text/35 mt-0.5">
                              {s.created_at.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5 max-w-xs">
                          {s.reason ? (
                            <span className="text-sm text-text/70 line-clamp-2">{s.reason}</span>
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
          </div>
        )}
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
  })

  const memberIds = recentlySanctioned.map((r) => r.target_id)
  const memberMap = await fetchDiscordUsers(memberIds)

  return (
    <div className="p-8 max-w-3xl">
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
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            {recentlySanctioned.map((entry, i) => {
              const user = memberMap.get(entry.target_id) ?? null
              const displayName = user?.globalName ?? user?.username ?? null
              const count = entry._count.id
              const isLast = i === recentlySanctioned.length - 1
              return (
                <Link
                  key={entry.target_id}
                  href={`/${locale}/dashboard/${guildId}/members?id=${entry.target_id}`}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.025] transition-colors ${!isLast ? "border-b border-border/30" : ""}`}
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
