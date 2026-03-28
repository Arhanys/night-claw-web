"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

type AppealStatus = "open" | "accepted" | "refused"

const STATUS_STYLE: Record<AppealStatus, { pill: string; dot: string }> = {
  open:     { pill: "bg-yellow-500/12 text-yellow-400 ring-1 ring-yellow-500/20", dot: "bg-yellow-400" },
  accepted: { pill: "bg-green-500/12  text-green-400  ring-1 ring-green-500/20",  dot: "bg-green-400"  },
  refused:  { pill: "bg-red-500/12    text-red-400    ring-1 ring-red-500/20",    dot: "bg-red-400"    },
}

interface DiscordUser {
  id: string
  username: string
  globalName: string | null
  avatar: string | null
}

export interface AppealRecord {
  id: number
  user_id: string
  source_guild_id: string
  appeal_reason: string
  ban_reason: string | null
  status: string | null
  reviewed_by: string | null
  decision_reason: string | null
  created_at: string | null
}

export interface AppealsStrings {
  status: string
  appellant: string
  appealReason: string
  banReason: string
  reviewedBy: string
  date: string
  noReason: string
  notReviewed: string
  discordId: string
  noResults: string
  previous: string
  next: string
  page: string
  of: string
  total: string
  statuses: Record<string, string>
}

function avatarUrl(userId: string, hash: string) {
  return `https://cdn.discordapp.com/avatars/${userId}/${hash}.webp?size=64`
}

function UserBlock({
  userId,
  user,
  label,
  discordIdLabel,
}: {
  userId: string
  user: DiscordUser | null
  label: string
  discordIdLabel: string
}) {
  const name = user?.globalName ?? user?.username ?? null
  const url = user?.avatar ? avatarUrl(userId, user.avatar) : null
  const initials = (name ?? userId)[0]?.toUpperCase() ?? "?"

  return (
    <div>
      <p className="text-[11px] text-text/35 uppercase tracking-wide font-semibold mb-1.5">{label}</p>
      <div className="flex items-center gap-2.5">
        {url ? (
          <Image src={url} alt={name ?? userId} width={32} height={32} className="rounded-full shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-text/60 shrink-0">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium">{name ?? userId}</p>
          {name && user?.username && (
            <p className="text-[11px] text-text/40 font-mono">@{user.username}</p>
          )}
          <p className="text-[11px] text-text/30 font-mono mt-0.5">{discordIdLabel}: {userId}</p>
        </div>
      </div>
    </div>
  )
}

function AppealModal({
  appeal,
  users,
  strings,
  timeLocale,
  onClose,
}: {
  appeal: AppealRecord
  users: Record<string, DiscordUser>
  strings: AppealsStrings
  timeLocale: string
  onClose: () => void
}) {
  const style = STATUS_STYLE[appeal.status as AppealStatus]
  const appellant = users[appeal.user_id] ?? null
  const reviewer = appeal.reviewed_by ? (users[appeal.reviewed_by] ?? null) : null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/[0.07] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style?.pill ?? "bg-white/10 text-text/60"}`}>
              {style && <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />}
              {strings.statuses[appeal.status ?? "open"] ?? appeal.status}
            </span>
            {appeal.created_at && (
              <span className="text-sm text-text/40">
                {new Date(appeal.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                {" · "}
                {new Date(appeal.created_at).toLocaleTimeString(timeLocale, { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-text/40 hover:text-text/80 transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5 overflow-y-auto">
          <div className="grid grid-cols-2 gap-5">
            <UserBlock userId={appeal.user_id} user={appellant} label={strings.appellant} discordIdLabel={strings.discordId} />
            {appeal.reviewed_by ? (
              <UserBlock userId={appeal.reviewed_by} user={reviewer} label={strings.reviewedBy} discordIdLabel={strings.discordId} />
            ) : (
              <div>
                <p className="text-[11px] text-text/35 uppercase tracking-wide font-semibold mb-1.5">{strings.reviewedBy}</p>
                <p className="text-sm text-text/30 italic">{strings.notReviewed}</p>
              </div>
            )}
          </div>

          <div className="border-t border-white/[0.07]" />

          <div>
            <p className="text-[11px] text-text/35 uppercase tracking-wide font-semibold mb-2">{strings.appealReason}</p>
            {appeal.appeal_reason ? (
              <p className="text-sm text-text/70 whitespace-pre-wrap">{appeal.appeal_reason}</p>
            ) : (
              <p className="text-sm text-text/30 italic">{strings.noReason}</p>
            )}
          </div>

          <div>
            <p className="text-[11px] text-text/35 uppercase tracking-wide font-semibold mb-2">{strings.banReason}</p>
            {appeal.ban_reason ? (
              <p className="text-sm text-text/70 whitespace-pre-wrap">{appeal.ban_reason}</p>
            ) : (
              <p className="text-sm text-text/30 italic">{strings.noReason}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AppealsList({
  appeals,
  users,
  strings,
  timeLocale,
  pageNum,
  totalPages,
  total,
  prevHref,
  nextHref,
}: {
  appeals: AppealRecord[]
  users: Record<string, DiscordUser>
  strings: AppealsStrings
  timeLocale: string
  pageNum: number
  totalPages: number
  total: number
  prevHref: string | null
  nextHref: string | null
}) {
  const [selected, setSelected] = useState<AppealRecord | null>(null)

  return (
    <>
      {selected && (
        <AppealModal
          appeal={selected}
          users={users}
          strings={strings}
          timeLocale={timeLocale}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {appeals.length === 0 ? (
          <div className="py-20 text-center text-text/40 text-sm rounded-2xl bg-card">
            {strings.noResults}
          </div>
        ) : appeals.map((appeal) => {
          const style = STATUS_STYLE[appeal.status as AppealStatus]
          const appellant = users[appeal.user_id] ?? null
          const reviewer = appeal.reviewed_by ? (users[appeal.reviewed_by] ?? null) : null
          const appellantName = appellant?.globalName ?? appellant?.username ?? appeal.user_id
          const appellantAvatar = appellant?.avatar ? avatarUrl(appeal.user_id, appellant.avatar) : null
          const reviewerName = reviewer?.globalName ?? reviewer?.username ?? appeal.reviewed_by
          return (
            <button
              key={appeal.id}
              onClick={() => setSelected(appeal)}
              className="w-full text-left rounded-xl bg-card border border-border p-4 space-y-3 hover:bg-elevated transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style?.pill ?? "bg-white/10 text-text/60"}`}>
                  {style && <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />}
                  {strings.statuses[appeal.status ?? "open"] ?? appeal.status}
                </span>
                <span className="text-xs text-text/40 shrink-0">
                  {appeal.created_at ? new Date(appeal.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {appellantAvatar ? (
                  <Image src={appellantAvatar} alt={appellantName} width={28} height={28} className="rounded-full shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-text/60 shrink-0">
                    {appellantName[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{appellantName}</p>
                  {appellant?.username && appellant.globalName && (
                    <p className="text-[11px] text-text/35 font-mono truncate">@{appellant.username}</p>
                  )}
                </div>
              </div>

              {appeal.appeal_reason && (
                <p className="text-xs text-text/70 line-clamp-3 pt-1">{appeal.appeal_reason}</p>
              )}

              {reviewerName && (
                <div className="flex items-center gap-1.5 text-xs text-text/40">
                  <span>{strings.reviewedBy}:</span>
                  <span className="font-medium text-text/60">{reviewerName}</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl bg-card border border-border overflow-hidden">
        {appeals.length === 0 ? (
          <div className="py-20 text-center text-text/40 text-sm">
            {strings.noResults}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-widest">{strings.status}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-widest">{strings.appellant}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-widest">{strings.appealReason}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-widest">{strings.banReason}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-widest">{strings.reviewedBy}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-widest">{strings.date}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.07]">
                {appeals.map((appeal) => {
                  const style = STATUS_STYLE[appeal.status as AppealStatus]
                  const appellant = users[appeal.user_id] ?? null
                  const reviewer = appeal.reviewed_by ? (users[appeal.reviewed_by] ?? null) : null
                  const appellantName = appellant?.globalName ?? appellant?.username ?? null
                  const reviewerName = reviewer?.globalName ?? reviewer?.username ?? null
                  const appellantAv = appellant?.avatar ? avatarUrl(appeal.user_id, appellant.avatar) : null
                  const reviewerAv = reviewer?.avatar && appeal.reviewed_by ? avatarUrl(appeal.reviewed_by, reviewer.avatar) : null
                  return (
                    <tr
                      key={appeal.id}
                      onClick={() => setSelected(appeal)}
                      className="hover:bg-elevated/80 transition-colors cursor-pointer border-b border-border last:border-0"
                    >
                      <td className="px-5 py-4 w-32">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style?.pill ?? "bg-white/10 text-text/60"}`}>
                          {style && <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />}
                          {strings.statuses[appeal.status ?? "open"] ?? appeal.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 w-52">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {appellantAv ? (
                            <Image src={appellantAv} alt={appellantName ?? appeal.user_id} width={28} height={28} className="rounded-full shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-text/60 shrink-0">
                              {(appellantName ?? appeal.user_id)[0]?.toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            {appellantName ? (
                              <p className="text-sm font-medium truncate">{appellantName}</p>
                            ) : (
                              <p className="text-sm font-mono text-text/50 truncate">{appeal.user_id}</p>
                            )}
                            {appellantName && appellant?.username && (
                              <p className="text-[11px] text-text/35 font-mono truncate">@{appellant.username}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 max-w-[200px]">
                        {appeal.appeal_reason ? (
                          <span className="text-sm text-text/70 line-clamp-2">{appeal.appeal_reason}</span>
                        ) : (
                          <span className="text-sm text-text/25 italic">{strings.noReason}</span>
                        )}
                      </td>

                      <td className="px-5 py-4 max-w-[200px]">
                        {appeal.ban_reason ? (
                          <span className="text-sm text-text/70 line-clamp-2">{appeal.ban_reason}</span>
                        ) : (
                          <span className="text-sm text-text/25 italic">{strings.noReason}</span>
                        )}
                      </td>

                      <td className="px-5 py-4 w-52">
                        {appeal.reviewed_by ? (
                          <div className="flex items-center gap-2.5 min-w-0">
                            {reviewerAv ? (
                              <Image src={reviewerAv} alt={reviewerName ?? appeal.reviewed_by} width={28} height={28} className="rounded-full shrink-0" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-text/60 shrink-0">
                                {(reviewerName ?? appeal.reviewed_by)[0]?.toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              {reviewerName ? (
                                <p className="text-sm font-medium truncate">{reviewerName}</p>
                              ) : (
                                <p className="text-sm font-mono text-text/50 truncate">{appeal.reviewed_by}</p>
                              )}
                              {reviewerName && reviewer?.username && (
                                <p className="text-[11px] text-text/35 font-mono truncate">@{reviewer.username}</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-text/25 italic">{strings.notReviewed}</span>
                        )}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {appeal.created_at ? (
                          <>
                            <div className="text-sm text-text/70">
                              {new Date(appeal.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                            <div className="text-[11px] text-text/35 mt-0.5">
                              {new Date(appeal.created_at).toLocaleTimeString(timeLocale, { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </>
                        ) : (
                          <span className="text-sm text-text/40">—</span>
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
            {strings.page} {pageNum} {strings.of} {totalPages} · {total.toLocaleString()} {strings.total}
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={prevHref ?? "#"}
              aria-disabled={!prevHref}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-colors ${
                !prevHref
                  ? "border-border text-text-muted/30 cursor-not-allowed"
                  : "border-border bg-card hover:bg-elevated hover:border-accent/30 text-text-muted hover:text-text"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              {strings.previous}
            </Link>
            <Link
              href={nextHref ?? "#"}
              aria-disabled={!nextHref}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-colors ${
                !nextHref
                  ? "border-border text-text-muted/30 cursor-not-allowed"
                  : "border-border bg-card hover:bg-elevated hover:border-accent/30 text-text-muted hover:text-text"
              }`}
            >
              {strings.next}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
