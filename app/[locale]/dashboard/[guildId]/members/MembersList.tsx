"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ChevronLeft, ChevronRight, X, ArrowLeft, ArrowRight } from "lucide-react"

export interface ClientMember {
  id: string
  username: string
  globalName: string | null
  avatar: string | null
  joinedAt: string | null
  sanctionCount: number
}

const PAGE_SIZE = 25
const VALID_SORTS = ["sanctions_desc", "sanctions_asc", "recent"] as const
type SortOption = (typeof VALID_SORTS)[number]

interface Strings {
  searchPlaceholder: string
  search: string
  noSanctionedMembers: string
  noSearchResults: string
  sanction: string
  sanctions: string
  total: string
  page: string
  of: string
  previous: string
  next: string
  sortSanctionsDesc: string
  sortSanctionsAsc: string
  sortRecent: string
  nextBatch: string
  prevBatch: string
}

function avatarUrl(userId: string, avatar: string | null) {
  if (!avatar) return null
  return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.webp?size=64`
}

function UserAvatar({ userId, username, globalName, avatar, size = 32 }: {
  userId: string
  username: string
  globalName: string | null
  avatar: string | null
  size?: number
}) {
  const url = avatarUrl(userId, avatar)
  const name = globalName ?? username
  const initials = name[0]?.toUpperCase() ?? "?"
  const dim = size === 40 ? "w-10 h-10" : "w-8 h-8"

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

export function MembersList({
  members,
  locale,
  guildId,
  cursors,
  hasMore,
  nextCursor,
  strings,
}: {
  members: ClientMember[]
  locale: string
  guildId: string
  cursors: string[]
  hasMore: boolean
  nextCursor: string | null
  strings: Strings
}) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortOption>("sanctions_desc")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = members
    const q = query.trim()
    if (q) {
      const lower = q.toLowerCase()
      result = result.filter(
        (m) =>
          m.id.includes(q) ||
          m.username.toLowerCase().includes(lower) ||
          (m.globalName?.toLowerCase().includes(lower) ?? false)
      )
    }
    const sorted = [...result]
    if (sort === "sanctions_asc") {
      sorted.sort((a, b) => a.sanctionCount - b.sanctionCount)
    } else if (sort === "recent") {
      sorted.sort((a, b) => {
        const aTime = a.joinedAt ? new Date(a.joinedAt).getTime() : 0
        const bTime = b.joinedAt ? new Date(b.joinedAt).getTime() : 0
        return bTime - aTime
      })
    } else {
      sorted.sort((a, b) => b.sanctionCount - a.sanctionCount)
    }
    return sorted
  }, [members, query, sort])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageMembers = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleQueryChange(val: string) {
    setQuery(val)
    setPage(1)
  }

  function handleSort(val: SortOption) {
    setSort(val)
    setPage(1)
  }

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "sanctions_desc", label: strings.sortSanctionsDesc },
    { value: "sanctions_asc",  label: strings.sortSanctionsAsc },
    { value: "recent",         label: strings.sortRecent },
  ]

  const baseHref = `/${locale}/dashboard/${guildId}/members`
  const prevHref = cursors.length > 0
    ? cursors.length > 1 ? `${baseHref}?cursors=${cursors.slice(0, -1).join(",")}` : baseHref
    : null
  const nextHref = hasMore && nextCursor
    ? `${baseHref}?cursors=${[...cursors, nextCursor].join(",")}`
    : null

  return (
    <>
      {/* Batch navigation */}
      {(prevHref || nextHref) && (
        <div className="flex items-center justify-between mb-4">
          {prevHref ? (
            <Link
              href={prevHref}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-elevated hover:border-accent/30 text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {strings.prevBatch}
            </Link>
          ) : <div />}
          {nextHref && (
            <Link
              href={nextHref}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-elevated hover:border-accent/30 text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              {strings.nextBatch}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}

      {/* Search */}
      <div className="relative flex-1 mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text/30 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder={strings.searchPlaceholder}
          className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-border bg-elevated text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 placeholder:text-text-muted/50 transition"
        />
        {query && (
          <button
            type="button"
            onClick={() => handleQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text/30 hover:text-text/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Sort + count row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm text-text/50">
          {filtered.length.toLocaleString()} {strings.total.toLowerCase()}
          {query.trim() && (
            <span className="ml-1 text-text/35">· &ldquo;{query.trim()}&rdquo;</span>
          )}
        </p>
        <div className="flex items-center gap-1.5">
          {SORT_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleSort(value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                sort === value
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "bg-elevated border border-border text-text-muted hover:text-text hover:border-accent/20"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Member list */}
      {pageMembers.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border py-16 text-center text-text/40 text-sm">
          {query.trim() ? strings.noSearchResults : strings.noSanctionedMembers}
        </div>
      ) : (
        <div className="rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border">
          {pageMembers.map((member) => {
            const displayName = member.globalName ?? member.username
            return (
              <Link
                key={member.id}
                href={`/${locale}/dashboard/${guildId}/members?id=${member.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.025] transition-colors"
              >
                <UserAvatar
                  userId={member.id}
                  username={member.username}
                  globalName={member.globalName}
                  avatar={member.avatar}
                  size={32}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{displayName}</p>
                  {member.globalName && (
                    <p className="text-xs text-text/35 font-mono truncate">@{member.username}</p>
                  )}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                  member.sanctionCount > 0
                    ? "text-text/60 bg-white/5"
                    : "text-text/25 bg-white/[0.03]"
                }`}>
                  {member.sanctionCount} {member.sanctionCount !== 1 ? strings.sanctions : strings.sanction}
                </span>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-sm text-text/40">
            {strings.page} {page} {strings.of} {totalPages} · {filtered.length.toLocaleString()} {strings.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-colors ${
                page <= 1
                  ? "border-border text-text-muted/30 cursor-not-allowed"
                  : "border-border bg-card hover:bg-elevated hover:border-accent/30 text-text-muted hover:text-text"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              {strings.previous}
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-colors ${
                page >= totalPages
                  ? "border-border text-text-muted/30 cursor-not-allowed"
                  : "border-border bg-card hover:bg-elevated hover:border-accent/30 text-text-muted hover:text-text"
              }`}
            >
              {strings.next}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
