"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, ChevronLeft, ChevronRight, ExternalLink, FileText, Hash } from "lucide-react"

interface UserInfo {
  id: string
  username: string
  globalName: string | null
  avatar: string | null
}

export interface ResolvedTicket {
  id: number
  channel_id: string
  channel_name: string | null
  user_id: string
  opened_at: string | null
  closed_at: string | null
  closed_by: string | null
  transcript_url: string | null
  opener: UserInfo | null
  closer: UserInfo | null
}

export interface TicketsStrings {
  noResults: string
  open: string
  closed: string
  channel: string
  opener: string
  closedBy: string
  openedAt: string
  closedAt: string
  discordId: string
  previous: string
  next: string
  page: string
  of: string
  total: string
  transcript: string
  noTranscript: string
  viewTranscript: string
  openInTab: string
  transcriptTitle: string
  notClosed: string
  unknown: string
}

function avatarUrl(userId: string, hash: string) {
  return `https://cdn.discordapp.com/avatars/${userId}/${hash}.webp?size=64`
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function formatTime(iso: string, timeLocale: string) {
  return new Date(iso).toLocaleTimeString(timeLocale, { hour: "2-digit", minute: "2-digit" })
}

function UserChip({ userId, user, label, discordIdLabel }: { userId: string; user: UserInfo | null; label: string; discordIdLabel: string }) {
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

function proxyUrl(url: string) {
  return `/api/transcript?url=${encodeURIComponent(url)}`
}

function TranscriptModal({ url, title, onClose, openInTab }: { url: string; title: string; onClose: () => void; openInTab: string }) {
  const proxied = proxyUrl(url)
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex flex-col"
      onClick={onClose}
    >
      <div
        className="flex flex-col flex-1 m-3 rounded-2xl overflow-hidden bg-card border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FileText className="h-4 w-4 text-accent shrink-0" />
            {title}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={proxied}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-text/60 hover:text-text text-xs font-medium transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {openInTab}
            </a>
            <button
              onClick={onClose}
              className="text-text/40 hover:text-text/80 transition-colors p-1.5 rounded-lg hover:bg-elevated"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        {/* Iframe */}
        <iframe
          src={proxied}
          className="flex-1 w-full border-0 bg-white"
          title="Ticket transcript"
        />
      </div>
    </div>
  )
}

function TicketModal({
  ticket,
  strings,
  timeLocale,
  onClose,
  onViewTranscript,
}: {
  ticket: ResolvedTicket
  strings: TicketsStrings
  timeLocale: string
  onClose: () => void
  onViewTranscript: () => void
}) {
  const isClosed = !!ticket.closed_at

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                isClosed
                  ? "bg-zinc-500/12 text-zinc-400 ring-1 ring-zinc-500/20"
                  : "bg-green-500/12 text-green-400 ring-1 ring-green-500/20"
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isClosed ? "bg-zinc-400" : "bg-green-400"}`} />
              {isClosed ? strings.closed : strings.open}
            </span>
            {ticket.channel_name && (
              <span className="flex items-center gap-1 text-sm text-text/50 font-mono">
                <Hash className="h-3.5 w-3.5 shrink-0" />
                {ticket.channel_name}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-text/40 hover:text-text/80 transition-colors p-1 rounded-lg hover:bg-elevated"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5 overflow-y-auto">
          <div className="grid grid-cols-2 gap-5">
            <UserChip
              userId={ticket.user_id}
              user={ticket.opener}
              label={strings.opener}
              discordIdLabel={strings.discordId}
            />
            {isClosed && ticket.closed_by ? (
              <UserChip
                userId={ticket.closed_by}
                user={ticket.closer}
                label={strings.closedBy}
                discordIdLabel={strings.discordId}
              />
            ) : (
              <div>
                <p className="text-[11px] text-text/35 uppercase tracking-wide font-semibold mb-1.5">{strings.closedBy}</p>
                <p className="text-sm text-text/30 italic">{strings.notClosed}</p>
              </div>
            )}
          </div>

          <div className="border-t border-border" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-text/35 uppercase tracking-wide font-semibold mb-1">{strings.openedAt}</p>
              {ticket.opened_at ? (
                <>
                  <p className="text-sm text-text/80">{formatDate(ticket.opened_at)}</p>
                  <p className="text-[11px] text-text/40 mt-0.5">{formatTime(ticket.opened_at, timeLocale)}</p>
                </>
              ) : (
                <p className="text-sm text-text/30 italic">{strings.unknown}</p>
              )}
            </div>
            <div>
              <p className="text-[11px] text-text/35 uppercase tracking-wide font-semibold mb-1">{strings.closedAt}</p>
              {ticket.closed_at ? (
                <>
                  <p className="text-sm text-text/80">{formatDate(ticket.closed_at)}</p>
                  <p className="text-[11px] text-text/40 mt-0.5">{formatTime(ticket.closed_at, timeLocale)}</p>
                </>
              ) : (
                <p className="text-sm text-text/30 italic">{strings.notClosed}</p>
              )}
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Transcript */}
          <div className="flex items-center justify-between gap-3">
            {ticket.transcript_url ? (
              <>
                <button
                  onClick={onViewTranscript}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  <FileText className="h-3.5 w-3.5" />
                  {strings.viewTranscript}
                </button>
                <a
                  href={proxyUrl(ticket.transcript_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-text/40 hover:text-text/70 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {strings.openInTab}
                </a>
              </>
            ) : (
              <p className="text-sm text-text/30 italic">{strings.noTranscript}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TicketsList({
  tickets,
  strings,
  timeLocale,
  pageNum,
  totalPages,
  total,
  prevHref,
  nextHref,
}: {
  tickets: ResolvedTicket[]
  strings: TicketsStrings
  timeLocale: string
  pageNum: number
  totalPages: number
  total: number
  prevHref: string | null
  nextHref: string | null
}) {
  const [selected, setSelected] = useState<ResolvedTicket | null>(null)
  const [transcriptOpen, setTranscriptOpen] = useState(false)

  return (
    <>
      {selected && (
        <TicketModal
          ticket={selected}
          strings={strings}
          timeLocale={timeLocale}
          onClose={() => { setSelected(null); setTranscriptOpen(false) }}
          onViewTranscript={() => setTranscriptOpen(true)}
        />
      )}

      {selected && transcriptOpen && selected.transcript_url && (
        <TranscriptModal
          url={selected.transcript_url}
          title={strings.transcriptTitle}
          onClose={() => setTranscriptOpen(false)}
          openInTab={strings.openInTab}
        />
      )}

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {tickets.length === 0 ? (
          <div className="py-20 text-center text-text/40 text-sm rounded-2xl bg-card">
            {strings.noResults}
          </div>
        ) : tickets.map((ticket) => {
          const isClosed = !!ticket.closed_at
          const openerName = ticket.opener?.globalName ?? ticket.opener?.username ?? ticket.user_id
          const openerAv = ticket.opener?.avatar ? avatarUrl(ticket.user_id, ticket.opener.avatar) : null
          return (
            <button
              key={ticket.id}
              onClick={() => { setSelected(ticket); setTranscriptOpen(false) }}
              className="w-full text-left rounded-xl bg-card border border-border p-4 space-y-3 hover:bg-elevated transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  isClosed
                    ? "bg-zinc-500/12 text-zinc-400 ring-1 ring-zinc-500/20"
                    : "bg-green-500/12 text-green-400 ring-1 ring-green-500/20"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isClosed ? "bg-zinc-400" : "bg-green-400"}`} />
                  {isClosed ? strings.closed : strings.open}
                </span>
                {ticket.channel_name && (
                  <span className="flex items-center gap-1 text-xs text-text/40 font-mono truncate">
                    <Hash className="h-3 w-3 shrink-0" />
                    {ticket.channel_name}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                {openerAv ? (
                  <Image src={openerAv} alt={openerName} width={28} height={28} className="rounded-full shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-text/60 shrink-0">
                    {openerName[0]?.toUpperCase()}
                  </div>
                )}
                <p className="text-sm font-medium truncate">{openerName}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-text/40">
                <span>{ticket.opened_at ? formatDate(ticket.opened_at) : "—"}</span>
                {ticket.transcript_url && (
                  <span className="flex items-center gap-1 text-accent/70">
                    <FileText className="h-3 w-3" />
                    {strings.transcript}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl bg-card overflow-hidden">
        {tickets.length === 0 ? (
          <div className="py-20 text-center text-text/40 text-sm">
            {strings.noResults}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">Status</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{strings.channel}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{strings.opener}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{strings.openedAt}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{strings.closedAt}</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-text/35 uppercase tracking-widest">{strings.transcript}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.07]">
                {tickets.map((ticket) => {
                  const isClosed = !!ticket.closed_at
                  const opener = ticket.opener
                  const openerName = opener?.globalName ?? opener?.username ?? null
                  const openerAv = opener?.avatar ? avatarUrl(ticket.user_id, opener.avatar) : null
                  return (
                    <tr
                      key={ticket.id}
                      onClick={() => { setSelected(ticket); setTranscriptOpen(false) }}
                      className="hover:bg-white/[0.025] transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4 w-28">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isClosed
                            ? "bg-zinc-500/12 text-zinc-400 ring-1 ring-zinc-500/20"
                            : "bg-green-500/12 text-green-400 ring-1 ring-green-500/20"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isClosed ? "bg-zinc-400" : "bg-green-400"}`} />
                          {isClosed ? strings.closed : strings.open}
                        </span>
                      </td>

                      <td className="px-5 py-4 max-w-[160px]">
                        {ticket.channel_name ? (
                          <span className="flex items-center gap-1 text-sm text-text/60 font-mono truncate">
                            <Hash className="h-3.5 w-3.5 shrink-0 text-text/30" />
                            {ticket.channel_name}
                          </span>
                        ) : (
                          <span className="text-sm text-text/25 font-mono truncate">{ticket.channel_id}</span>
                        )}
                      </td>

                      <td className="px-5 py-4 w-52">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {openerAv ? (
                            <Image src={openerAv} alt={openerName ?? ticket.user_id} width={28} height={28} className="rounded-full shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-text/60 shrink-0">
                              {(openerName ?? ticket.user_id)[0]?.toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            {openerName ? (
                              <p className="text-sm font-medium truncate">{openerName}</p>
                            ) : (
                              <p className="text-sm font-mono text-text/50 truncate">{ticket.user_id}</p>
                            )}
                            {openerName && opener?.username && (
                              <p className="text-[11px] text-text/35 font-mono truncate">@{opener.username}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {ticket.opened_at ? (
                          <>
                            <div className="text-sm text-text/70">{formatDate(ticket.opened_at)}</div>
                            <div className="text-[11px] text-text/35 mt-0.5">{formatTime(ticket.opened_at, timeLocale)}</div>
                          </>
                        ) : (
                          <span className="text-sm text-text/40">—</span>
                        )}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {ticket.closed_at ? (
                          <>
                            <div className="text-sm text-text/70">{formatDate(ticket.closed_at)}</div>
                            <div className="text-[11px] text-text/35 mt-0.5">{formatTime(ticket.closed_at, timeLocale)}</div>
                          </>
                        ) : (
                          <span className="text-sm text-text/25 italic">{strings.notClosed}</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {ticket.transcript_url ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-accent/80 font-medium">
                            <FileText className="h-3.5 w-3.5" />
                            {strings.transcript}
                          </span>
                        ) : (
                          <span className="text-sm text-text/25 italic">{strings.noTranscript}</span>
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
                  ? "border-border/20 text-text/20 cursor-not-allowed"
                  : "border-border/50 hover:bg-elevated text-text/70 hover:text-text"
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
                  ? "border-border/20 text-text/20 cursor-not-allowed"
                  : "border-border/50 hover:bg-elevated text-text/70 hover:text-text"
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
