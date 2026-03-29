"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import {
  LayoutDashboard, Shield, Scale, Users, Wifi, ShieldCheck,
  Ticket, Settings,
} from "lucide-react"
import { useScopedI18n } from "@/locales/client"
import ScrollReveal from "@/components/marketing/ScrollReveal"
import SectionHeading from "@/components/ui/SectionHeading"

const StatsCharts = dynamic(() => import("@/components/dashboard/StatsCharts"), { ssr: false })

// ── Mock data (static — no Date() calls to prevent hydration mismatch) ──────

const MOCK_SANCTIONS_BY_ACTION = [
  { action: "ban",  count: 34 },
  { action: "kick", count: 19 },
  { action: "mute", count: 52 },
  { action: "warn", count: 87 },
]

const MOCK_DAILY_ACTIVITY = [
  { date: "2026-02-28", count: 3  },
  { date: "2026-03-01", count: 7  },
  { date: "2026-03-02", count: 2  },
  { date: "2026-03-03", count: 11 },
  { date: "2026-03-04", count: 5  },
  { date: "2026-03-05", count: 8  },
  { date: "2026-03-06", count: 14 },
  { date: "2026-03-07", count: 6  },
  { date: "2026-03-08", count: 9  },
  { date: "2026-03-09", count: 3  },
  { date: "2026-03-10", count: 12 },
  { date: "2026-03-11", count: 7  },
  { date: "2026-03-12", count: 4  },
  { date: "2026-03-13", count: 16 },
  { date: "2026-03-14", count: 10 },
  { date: "2026-03-15", count: 5  },
  { date: "2026-03-16", count: 8  },
  { date: "2026-03-17", count: 13 },
  { date: "2026-03-18", count: 6  },
  { date: "2026-03-19", count: 9  },
  { date: "2026-03-20", count: 4  },
  { date: "2026-03-21", count: 11 },
  { date: "2026-03-22", count: 7  },
  { date: "2026-03-23", count: 15 },
  { date: "2026-03-24", count: 8  },
  { date: "2026-03-25", count: 5  },
  { date: "2026-03-26", count: 10 },
  { date: "2026-03-27", count: 3  },
  { date: "2026-03-28", count: 7  },
  { date: "2026-03-29", count: 9  },
]

const MOCK_APPEAL_STATUSES = [
  { status: "accepted", count: 14 },
  { status: "refused",  count: 8  },
  { status: "open",     count: 5  },
]

const MOCK_TICKET_STATS = { total: 47, closed: 39 }

const MOCK_SANCTION_ROWS = [
  { id: 1, action: "ban",  target: "ChaosWolf",    mod: "NightMod",   reason: "Repeated harassment",    date: "Mar 28" },
  { id: 2, action: "mute", target: "SpamBot99",    mod: "StarGuard",  reason: "Spam in #general",       date: "Mar 27" },
  { id: 3, action: "warn", target: "ToxicUser42",  mod: "NightMod",   reason: "Offensive language",     date: "Mar 26" },
  { id: 4, action: "kick", target: "RaidAttacker", mod: "AuraKeeper", reason: "Raiding the server",     date: "Mar 25" },
  { id: 5, action: "warn", target: "LurkerX",      mod: "StarGuard",  reason: "NSFW in wrong channel",  date: "Mar 24" },
] as const

const MOCK_APPEAL_ROWS = [
  { id: 1, user: "ChaosWolf",   status: "open",     reason: "It was a misunderstanding, I can explain",  date: "Mar 29" },
  { id: 2, user: "OldUser88",   status: "accepted", reason: "I've changed and I miss the community",      date: "Mar 22" },
  { id: 3, user: "BannedDude7", status: "refused",  reason: "I did nothing wrong, staff is biased",       date: "Mar 18" },
  { id: 4, user: "GhostMember", status: "open",     reason: "The ban was applied to the wrong account",   date: "Mar 15" },
] as const

type Tab = "overview" | "sanctions" | "appeals"

const ACTION_STYLE = {
  ban:  { pill: "bg-red-500/10 text-red-400 ring-1 ring-red-500/20",          label: "Ban"  },
  kick: { pill: "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20", label: "Kick" },
  mute: { pill: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20", label: "Mute" },
  warn: { pill: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",       label: "Warn" },
} as const

const APPEAL_STYLE = {
  open:     { pill: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20", label: "Open"     },
  accepted: { pill: "bg-green-500/10 text-green-400 ring-1 ring-green-500/20",    label: "Accepted" },
  refused:  { pill: "bg-red-500/10 text-red-400 ring-1 ring-red-500/20",          label: "Refused"  },
} as const

// ── Sub-components ────────────────────────────────────────────────────────────

function OverviewTab({ t, tCharts, tAppeals }: {
  t: ReturnType<typeof useScopedI18n<"home.dashboardPreview">>
  tCharts: ReturnType<typeof useScopedI18n<"dashboard.overview.charts">>
  tAppeals: ReturnType<typeof useScopedI18n<"dashboard.appeals">>
}) {
  const chartStrings = {
    sanctionsBreakdown:    tCharts("sanctionsBreakdown"),
    sanctionsBreakdownSub: tCharts("sanctionsBreakdownSub"),
    activityTimeline:      tCharts("activityTimeline"),
    activityTimelineSub:   tCharts("activityTimelineSub"),
    appealStatus:          tCharts("appealStatus"),
    allTime:               tCharts("allTime"),
    appealStatusLabels: {
      open:     tAppeals("statuses.open"),
      accepted: tAppeals("statuses.accepted"),
      refused:  tAppeals("statuses.refused"),
    },
    ticketResolution:    tCharts("ticketResolution"),
    ticketResolutionSub: tCharts("ticketResolutionSub"),
    noData:              tCharts("noData"),
    resolved:            tCharts("resolved"),
  }

  return (
    <div>
      {/* Guild header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-base font-bold text-accent shrink-0">
          N
        </div>
        <div>
          <p className="font-bold text-sm">NightClaw Demo</p>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
            Administrator
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-card border border-border rounded-xl p-3 border-l-2 border-l-accent">
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="h-3.5 w-3.5 text-accent" />
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">{t("membersLabel")}</span>
          </div>
          <p className="text-xl font-bold font-display">1,247</p>
          <p className="text-[11px] text-text-muted mt-0.5">
            <span className="text-green-400 font-semibold">342</span> {t("onlineLabel")}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 border-l-2 border-l-accent-secondary">
          <div className="flex items-center gap-1.5 mb-1">
            <Wifi className="h-3.5 w-3.5 text-accent-secondary" />
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">{t("botStatusLabel")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <p className="text-sm font-bold">{t("botOnline")}</p>
          </div>
          <p className="text-[11px] text-text-muted mt-0.5">{t("botActive")}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 border-l-2 border-l-violet-500">
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldCheck className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">{t("yourRoleLabel")}</span>
          </div>
          <p className="text-xl font-bold font-display">{t("adminRole")}</p>
          <p className="text-[11px] text-text-muted mt-0.5">{t("fullAccess")}</p>
        </div>
      </div>

      {/* Charts — pointer-events-none so tooltips don't disrupt the page */}
      <div className="pointer-events-none">
        <StatsCharts
          sanctionsByAction={MOCK_SANCTIONS_BY_ACTION}
          dailyActivity={MOCK_DAILY_ACTIVITY}
          appealStatuses={MOCK_APPEAL_STATUSES}
          ticketStats={MOCK_TICKET_STATS}
          strings={chartStrings}
        />
      </div>

      {/* Quick links */}
      <div className="mb-5">
        <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3">{t("quickAccess")}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pointer-events-none">
          {[
            { icon: <Shield className="h-4 w-4 text-red-400" />,           label: "Sanctions",  bg: "bg-red-500/8"    },
            { icon: <Scale className="h-4 w-4 text-yellow-400" />,          label: "Appeals",    bg: "bg-yellow-500/8" },
            { icon: <Ticket className="h-4 w-4 text-accent-secondary" />,   label: "Tickets",    bg: "bg-accent-secondary/8" },
            { icon: <Settings className="h-4 w-4 text-accent" />,           label: "Config",     bg: "bg-accent/8"     },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 px-3 py-2.5 bg-card border border-border rounded-xl"
            >
              <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                {item.icon}
              </div>
              <span className="text-xs font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mod team */}
      <div>
        <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3">{t("modTeamLabel")}</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { name: "NightMod",   color: "bg-violet-500/20 text-violet-300"  },
            { name: "StarGuard",  color: "bg-cyan-500/20 text-cyan-300"       },
            { name: "AuraKeeper", color: "bg-indigo-500/20 text-indigo-300"  },
          ].map((m) => (
            <div key={m.name} className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-full">
              <div className={`w-5 h-5 rounded-full ${m.color} flex items-center justify-center text-[10px] font-bold shrink-0`}>
                {m.name[0]}
              </div>
              <span className="text-xs font-medium">{m.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SanctionsTab({ t }: { t: ReturnType<typeof useScopedI18n<"home.dashboardPreview">> }) {
  return (
    <div>
      {/* Filter pills */}
      <div className="flex gap-1.5 mb-4 flex-wrap pointer-events-none">
        {(["All", "Ban", "Kick", "Mute", "Warn"] as const).map((label, i) => (
          <span
            key={label}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
              i === 0
                ? "bg-accent/15 text-accent border-accent/30"
                : "bg-card text-text-muted border-border"
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[80px_1fr_100px_1fr_70px] gap-3 px-4 py-2.5 border-b border-border">
          {[t("sanctionsColAction"), t("sanctionsColTarget"), t("sanctionsColMod"), t("sanctionsColReason"), t("sanctionsColDate")].map((col) => (
            <span key={col} className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{col}</span>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {MOCK_SANCTION_ROWS.map((row) => {
            const style = ACTION_STYLE[row.action]
            return (
              <div key={row.id} className="grid grid-cols-[80px_1fr] sm:grid-cols-[80px_1fr_100px_1fr_70px] gap-3 items-center px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold w-fit ${style.pill}`}>
                  {style.label}
                </span>
                <span className="text-sm font-semibold truncate">{row.target}</span>
                <span className="hidden sm:block text-xs text-text-muted truncate">{row.mod}</span>
                <span className="hidden sm:block text-xs text-text-muted truncate">{row.reason}</span>
                <span className="hidden sm:block text-xs text-text-muted">{row.date}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function AppealsTab({ t }: { t: ReturnType<typeof useScopedI18n<"home.dashboardPreview">> }) {
  return (
    <div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[90px_120px_1fr_70px] gap-3 px-4 py-2.5 border-b border-border">
          {[t("appealsColStatus"), t("appealsColUser"), t("appealsColReason"), t("appealsColDate")].map((col) => (
            <span key={col} className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{col}</span>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {MOCK_APPEAL_ROWS.map((row) => {
            const style = APPEAL_STYLE[row.status]
            return (
              <div key={row.id} className="grid grid-cols-[90px_1fr] sm:grid-cols-[90px_120px_1fr_70px] gap-3 items-center px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold w-fit ${style.pill}`}>
                  {style.label}
                </span>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-[10px] font-bold text-accent shrink-0">
                    {row.user[0]}
                  </div>
                  <span className="text-sm font-semibold truncate">{row.user}</span>
                </div>
                <span className="hidden sm:block text-xs text-text-muted truncate">{row.reason}</span>
                <span className="hidden sm:block text-xs text-text-muted">{row.date}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function DashboardPreview() {
  const t       = useScopedI18n("home.dashboardPreview")
  const tCharts = useScopedI18n("dashboard.overview.charts")
  const tAppeals = useScopedI18n("dashboard.appeals")
  const [activeTab, setActiveTab] = useState<Tab>("overview")

  const tabs: { id: Tab; icon: React.ReactNode }[] = [
    { id: "overview",  icon: <LayoutDashboard className="h-4 w-4 shrink-0" /> },
    { id: "sanctions", icon: <Shield className="h-4 w-4 shrink-0" /> },
    { id: "appeals",   icon: <Scale className="h-4 w-4 shrink-0" /> },
  ]

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-dot-grid opacity-[0.025] pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal>
          <SectionHeading
            title={t("title")}
            subtitle={t("subtitle")}
            badge={t("badge")}
            align="center"
            accentColor="cyan"
          />
        </ScrollReveal>

        <ScrollReveal y={32}>
          <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-accent-secondary/5 card-glow-border-cyan border border-border">

            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-elevated border-b border-border shrink-0">
              <span className="w-3 h-3 rounded-full bg-red-400/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/60" />
              <span className="w-3 h-3 rounded-full bg-green-400/60" />
              <div className="ml-3 flex-1 max-w-xs">
                <div className="bg-background rounded-md px-3 py-1 text-[11px] font-mono text-text-muted border border-border select-none">
                  nightclaw.xyz/dashboard/demo
                </div>
              </div>
              <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20 select-none">
                {t("previewBadge")}
              </span>
            </div>

            {/* App shell */}
            <div className="flex bg-background" style={{ minHeight: 540 }}>

              {/* Sidebar — md+ only */}
              <aside className="hidden md:flex flex-col w-48 shrink-0 bg-card border-r border-border p-3 gap-1">
                <div className="flex items-center gap-2.5 px-3 py-2.5 mb-2 border-b border-border">
                  <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center text-sm font-bold text-accent shrink-0">
                    N
                  </div>
                  <span className="text-sm font-semibold truncate">NightClaw</span>
                </div>
                {tabs.map(({ id, icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left w-full ${
                      activeTab === id
                        ? "bg-accent/10 text-accent"
                        : "text-text-muted hover:bg-elevated hover:text-text"
                    }`}
                  >
                    {icon}
                    {t(`tab.${id}`)}
                  </button>
                ))}
              </aside>

              {/* Content area */}
              <div className="flex-1 min-w-0">

                {/* Mobile tab bar */}
                <div className="md:hidden flex border-b border-border bg-card">
                  {tabs.map(({ id }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                        activeTab === id
                          ? "text-accent border-b-2 border-accent"
                          : "text-text-muted"
                      }`}
                    >
                      {t(`tab.${id}`)}
                    </button>
                  ))}
                </div>

                {/* Tab panels */}
                <div className="p-4 sm:p-6 overflow-auto" style={{ maxHeight: 500 }}>
                  {activeTab === "overview"  && <OverviewTab t={t} tCharts={tCharts} tAppeals={tAppeals} />}
                  {activeTab === "sanctions" && <SanctionsTab t={t} />}
                  {activeTab === "appeals"   && <AppealsTab t={t} />}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
