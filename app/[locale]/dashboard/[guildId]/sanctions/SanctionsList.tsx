"use client"

import { useState, useTransition, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Trash2, Pencil, ChevronLeft, ChevronRight } from "lucide-react"
import { updateReason, deleteSanction } from "./actions"

type ActionType = "ban" | "kick" | "mute" | "warn"

const ACTION_STYLE: Record<ActionType, { pill: string; dot: string; label: string }> = {
  ban:  { pill: "bg-red-500/12 text-red-400 ring-1 ring-red-500/20",         dot: "bg-red-400",    label: "Ban" },
  kick: { pill: "bg-orange-500/12 text-orange-400 ring-1 ring-orange-500/20", dot: "bg-orange-400", label: "Kick" },
  mute: { pill: "bg-yellow-500/12 text-yellow-400 ring-1 ring-yellow-500/20", dot: "bg-yellow-400", label: "Mute" },
  warn: { pill: "bg-blue-500/12 text-blue-400 ring-1 ring-blue-500/20",       dot: "bg-blue-400",   label: "Warn" },
}

interface UserInfo {
  id: string
  username: string
  globalName: string | null
  avatar: string | null
}

export interface ResolvedLog {
  id: number
  action: string
  target_id: string
  moderator_id: string
  reason: string | null
  created_at: string | null
  target: UserInfo | null
  mod: UserInfo | null
}

export interface SanctionsStrings {
  action: string
  target: string
  moderator: string
  date: string
  reason: string
  noReason: string
  discordId: string
  noResults: string
  previous: string
  next: string
  page: string
  of: string
  total: string
  details: string
  edit: string
  editReason: string
  saveReason: string
  cancel: string
  deleteTitle: string
  deleteConfirm: string
  saved: string
}

function avatarUrl(userId: string, hash: string) {
  return `https://cdn.discordapp.com/avatars/${userId}/${hash}.webp?size=64`
}

function UserRow({ userId, user, label, discordIdLabel }: { userId: string; user: UserInfo | null; label: string; discordIdLabel: string }) {
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

export function SanctionModal({
  selected,
  isAdmin,
  guildId,
  strings,
  timeLocale,
  onClose,
  onSaved,
  onDeleted,
}: {
  selected: ResolvedLog
  isAdmin: boolean
  guildId: string
  strings: SanctionsStrings
  timeLocale: string
  onClose: () => void
  onSaved: (id: number, reason: string | null) => void
  onDeleted: (id: number) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editReason, setEditReason] = useState(selected.reason ?? "")
  const [savedMsg, setSavedMsg] = useState(false)
  const [saving, startSave] = useTransition()
  const [deleting, startDelete] = useTransition()

  useEffect(() => {
    setIsEditing(false)
    setEditReason(selected.reason ?? "")
    setSavedMsg(false)
  }, [selected.id, selected.reason])

  function handleSave() {
    startSave(async () => {
      await updateReason(selected.id, editReason, guildId)
      const newReason = editReason.trim() || null
      onSaved(selected.id, newReason)
      setIsEditing(false)
      setSavedMsg(true)
    })
  }

  function handleDelete() {
    if (!window.confirm(strings.deleteConfirm)) return
    startDelete(async () => {
      await deleteSanction(selected.id, guildId)
      onDeleted(selected.id)
      onClose()
    })
  }

  function handleCancel() {
    setEditReason(selected.reason ?? "")
    setIsEditing(false)
  }

  const style = ACTION_STYLE[selected.action as ActionType]

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
              {style?.label ?? selected.action}
            </span>
            {selected.created_at && (
              <span className="text-sm text-text/40">
                {new Date(selected.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                {" · "}
                {new Date(selected.created_at).toLocaleTimeString(timeLocale, { hour: "2-digit", minute: "2-digit" })}
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
            <UserRow userId={selected.target_id} user={selected.target} label={strings.target} discordIdLabel={strings.discordId} />
            <UserRow userId={selected.moderator_id} user={selected.mod} label={strings.moderator} discordIdLabel={strings.discordId} />
          </div>

          <div className="border-t border-white/[0.07]" />

          <div>
            <p className="text-[11px] text-text/35 uppercase tracking-wide font-semibold mb-2">{strings.editReason}</p>
            <textarea
              value={editReason}
              onChange={(e) => { setEditReason(e.target.value); setSavedMsg(false) }}
              readOnly={!isEditing}
              rows={4}
              placeholder={strings.noReason}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm resize-none transition-colors ${
                isEditing
                  ? "bg-white/[0.04] border-white/[0.08] text-text/80 placeholder:text-text/25 focus:outline-none focus:ring-1 focus:ring-accent/50"
                  : "bg-transparent border-transparent text-text/70 cursor-default focus:outline-none"
              }`}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 text-text/70 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {strings.edit}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "..." : strings.saveReason}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-sm text-text/40 hover:text-text/70 transition-colors px-2 py-2"
                  >
                    {strings.cancel}
                  </button>
                </>
              )}
              {savedMsg && (
                <span className="text-xs text-green-400">{strings.saved}</span>
              )}
            </div>

            {isAdmin && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleting ? "..." : strings.deleteTitle}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SanctionsList({
  initialLogs,
  isAdmin,
  guildId,
  strings,
  timeLocale,
  pageNum,
  totalPages,
  total,
  prevHref,
  nextHref,
}: {
  initialLogs: ResolvedLog[]
  isAdmin: boolean
  guildId: string
  strings: SanctionsStrings
  timeLocale: string
  pageNum: number
  totalPages: number
  total: number
  prevHref: string | null
  nextHref: string | null
}) {
  const [logs, setLogs] = useState(initialLogs)
  const [selected, setSelected] = useState<ResolvedLog | null>(null)

  useEffect(() => {
    setLogs(initialLogs)
  }, [initialLogs])

  return (
    <>
      {selected && (
        <SanctionModal
          selected={selected}
          isAdmin={isAdmin}
          guildId={guildId}
          strings={strings}
          timeLocale={timeLocale}
          onClose={() => setSelected(null)}
          onSaved={(id, reason) => {
            setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, reason } : l)))
            setSelected((prev) => (prev ? { ...prev, reason } : null))
          }}
          onDeleted={(id) => {
            setLogs((prev) => prev.filter((l) => l.id !== id))
            setSelected(null)
          }}
        />
      )}

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {logs.length === 0 ? (
          <div className="py-20 text-center text-text/40 text-sm rounded-2xl bg-card">
            {strings.noResults}
          </div>
        ) : logs.map((log) => {
          const style = ACTION_STYLE[log.action as ActionType]
          const targetName = log.target?.globalName ?? log.target?.username ?? log.target_id
          const modName = log.mod?.globalName ?? log.mod?.username ?? log.moderator_id
          const targetAv = log.target?.avatar ? avatarUrl(log.target_id, log.target.avatar) : null
          const modAv = log.mod?.avatar ? avatarUrl(log.moderator_id, log.mod.avatar) : null
          return (
            <button
              key={log.id}
              onClick={() => setSelected(log)}
              className="w-full text-left rounded-xl bg-card border border-border p-4 space-y-3 hover:bg-elevated transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style?.pill ?? "bg-white/10 text-text/60"}`}>
                  {style && <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />}
                  {style?.label ?? log.action}
                </span>
                <span className="text-xs text-text/40 shrink-0">
                  {log.created_at ? new Date(log.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {targetAv ? (
                  <Image src={targetAv} alt={targetName} width={28} height={28} className="rounded-full shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-text/60 shrink-0">
                    {targetName[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{targetName}</p>
                  {log.target?.username && log.target.globalName && (
                    <p className="text-[11px] text-text/35 font-mono truncate">@{log.target.username}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-text/50">
                {modAv ? (
                  <Image src={modAv} alt={modName} width={20} height={20} className="rounded-full shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {modName[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-xs truncate">{strings.moderator}: {modName}</span>
              </div>

              {log.reason ? (
                <p className="text-xs text-text/60 line-clamp-2 pt-1">{log.reason}</p>
              ) : (
                <p className="text-xs text-text/25 italic pt-1">{strings.noReason}</p>
              )}
            </button>
          )
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl bg-card border border-border overflow-hidden">
        {logs.length === 0 ? (
          <div className="py-20 text-center text-text/40 text-sm">
            {strings.noResults}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-widest">{strings.action}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-widest">{strings.target}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-widest">{strings.moderator}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-widest">{strings.date}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-widest">{strings.reason}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.07]">
                {logs.map((log) => {
                  const style = ACTION_STYLE[log.action as ActionType]
                  const target = log.target
                  const mod = log.mod
                  const targetAv = target?.avatar ? avatarUrl(log.target_id, target.avatar) : null
                  const modAv = mod?.avatar ? avatarUrl(log.moderator_id, mod.avatar) : null
                  const targetName = target?.globalName ?? target?.username ?? null
                  const modName = mod?.globalName ?? mod?.username ?? null
                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelected(log)}
                      className="hover:bg-elevated/80 transition-colors cursor-pointer border-b border-border last:border-0"
                    >
                      <td className="px-5 py-4 w-28">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style?.pill ?? "bg-white/10 text-text/60"}`}>
                          {style && <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />}
                          {style?.label ?? log.action}
                        </span>
                      </td>
                      <td className="px-5 py-4 w-52">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {targetAv ? (
                            <Image src={targetAv} alt={targetName ?? log.target_id} width={28} height={28} className="rounded-full shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-text/60 shrink-0">
                              {(targetName ?? log.target_id)[0]?.toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            {targetName ? (
                              <p className="text-sm font-medium truncate">{targetName}</p>
                            ) : (
                              <p className="text-sm font-mono text-text/50 truncate">{log.target_id}</p>
                            )}
                            {targetName && target?.username && (
                              <p className="text-[11px] text-text/35 font-mono truncate">@{target.username}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 w-52">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {modAv ? (
                            <Image src={modAv} alt={modName ?? log.moderator_id} width={28} height={28} className="rounded-full shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-text/60 shrink-0">
                              {(modName ?? log.moderator_id)[0]?.toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            {modName ? (
                              <p className="text-sm font-medium truncate">{modName}</p>
                            ) : (
                              <p className="text-sm font-mono text-text/50 truncate">{log.moderator_id}</p>
                            )}
                            {modName && mod?.username && (
                              <p className="text-[11px] text-text/35 font-mono truncate">@{mod.username}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {log.created_at ? (
                          <>
                            <div className="text-sm text-text/70">
                              {new Date(log.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                            <div className="text-[11px] text-text/35 mt-0.5">
                              {new Date(log.created_at).toLocaleTimeString(timeLocale, { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </>
                        ) : (
                          <span className="text-sm text-text/40">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        {log.reason ? (
                          <span className="text-sm text-text/70 line-clamp-2">{log.reason}</span>
                        ) : (
                          <span className="text-sm text-text/25 italic">{strings.noReason}</span>
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
