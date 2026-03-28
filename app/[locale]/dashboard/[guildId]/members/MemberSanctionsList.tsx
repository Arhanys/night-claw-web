"use client"

import { useState } from "react"
import Image from "next/image"
import { SanctionModal, SanctionsStrings } from "../sanctions/SanctionsList"

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

export interface MemberLog {
  id: number
  action: string
  target_id: string
  moderator_id: string
  reason: string | null
  created_at: string | null
  mod: UserInfo | null
}

function avatarUrl(userId: string, hash: string) {
  return `https://cdn.discordapp.com/avatars/${userId}/${hash}.webp?size=64`
}

export function MemberSanctionsList({
  initialLogs,
  isAdmin,
  guildId,
  targetUser,
  strings,
  timeLocale,
  noSanctionsLabel,
  allSanctionsLabel,
}: {
  initialLogs: MemberLog[]
  isAdmin: boolean
  guildId: string
  targetUser: UserInfo | null
  strings: SanctionsStrings
  timeLocale: string
  noSanctionsLabel: string
  allSanctionsLabel: string
}) {
  const [logs, setLogs] = useState(initialLogs)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const selected = selectedId !== null ? logs.find((l) => l.id === selectedId) ?? null : null

  // SanctionModal expects a ResolvedLog — adapt MemberLog by injecting the shared targetUser
  const selectedResolved = selected
    ? { ...selected, target: targetUser }
    : null

  if (logs.length === 0) {
    return (
      <div className="rounded-2xl bg-card py-16 text-center text-text/40 text-sm">
        {noSanctionsLabel}
      </div>
    )
  }

  return (
    <>
      {selectedResolved && (
        <SanctionModal
          selected={selectedResolved}
          isAdmin={isAdmin}
          guildId={guildId}
          strings={strings}
          timeLocale={timeLocale}
          onClose={() => setSelectedId(null)}
          onSaved={(id, reason) => {
            setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, reason } : l)))
          }}
          onDeleted={(id) => {
            setLogs((prev) => prev.filter((l) => l.id !== id))
            setSelectedId(null)
          }}
        />
      )}

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="px-5 py-3.5">
          <h2 className="text-sm font-semibold text-text/50 uppercase tracking-wide">
            {allSanctionsLabel}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-widest">{strings.action}</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-widest">{strings.moderator}</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-widest">{strings.date}</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-widest">{strings.reason}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {logs.map((s) => {
                const style = ACTION_STYLE[s.action as ActionType]
                const mod = s.mod
                const modName = mod?.globalName ?? mod?.username ?? null
                const modAv = mod?.avatar ? avatarUrl(s.moderator_id, mod.avatar) : null
                return (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className="hover:bg-elevated/80 transition-colors cursor-pointer border-b border-border last:border-0"
                  >
                    <td className="px-5 py-3.5 w-28">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style?.pill ?? "bg-white/10 text-text/60"}`}>
                        {style && <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />}
                        {style?.label ?? s.action}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 w-44">
                      <div className="flex items-center gap-2 min-w-0">
                        {modAv ? (
                          <Image src={modAv} alt={modName ?? s.moderator_id} width={28} height={28} className="rounded-full shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-text/60 shrink-0">
                            {(modName ?? s.moderator_id)[0]?.toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm truncate">
                          {modName ?? <span className="font-mono text-text/40 text-xs">{s.moderator_id}</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {s.created_at ? (
                        <>
                          <div className="text-sm text-text/70">
                            {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                          <div className="text-[11px] text-text/35 mt-0.5">
                            {new Date(s.created_at).toLocaleTimeString(timeLocale, { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-text/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      {s.reason ? (
                        <span className="text-sm text-text/70 line-clamp-2">{s.reason}</span>
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
      </div>
    </>
  )
}
