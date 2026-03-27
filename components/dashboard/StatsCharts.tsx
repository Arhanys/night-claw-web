"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts"

export interface SanctionByAction {
  action: string
  count: number
}

export interface DailyActivity {
  date: string
  count: number
}

export interface AppealStatus {
  status: string | null
  count: number
}

export interface TicketStats {
  total: number
  closed: number
}

interface Props {
  sanctionsByAction: SanctionByAction[]
  dailyActivity: DailyActivity[]
  appealStatuses: AppealStatus[]
  ticketStats: TicketStats
  strings: {
    sanctionsBreakdown: string
    sanctionsBreakdownSub: string
    activityTimeline: string
    activityTimelineSub: string
    appealStatus: string
    ticketResolution: string
    ticketResolutionSub: string
    noData: string
    resolved: string
  }
}

const ACTION_COLORS: Record<string, string> = {
  ban:  "#EF4444",
  kick: "#F97316",
  mute: "#EAB308",
  warn: "#3B82F6",
}

const APPEAL_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  open:     { bg: "bg-yellow-500/10", text: "text-yellow-400", bar: "bg-yellow-400" },
  accepted: { bg: "bg-green-500/10",  text: "text-green-400",  bar: "bg-green-400"  },
  refused:  { bg: "bg-red-500/10",    text: "text-red-400",    bar: "bg-red-400"    },
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <p className="text-sm font-bold mb-0.5">{title}</p>
      <p className="text-xs text-text-muted mb-4">{subtitle}</p>
      {children}
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-elevated border border-border rounded-xl px-3 py-2 shadow-2xl text-xs">
      {label && <p className="text-text-muted mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-semibold" style={{ color: p.color ?? p.fill }}>
          {p.name ? `${p.name}: ` : ""}{p.value}
        </p>
      ))}
    </div>
  )
}

export default function StatsCharts({
  sanctionsByAction,
  dailyActivity,
  appealStatuses,
  ticketStats,
  strings,
}: Props) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = !mounted || resolvedTheme === "dark"

  const gridStroke  = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"
  const tickFill    = isDark ? "#6B7280" : "#94A3B8"
  const violetFill  = isDark ? "#8B5CF6" : "#7C3AED"
  const areaGradId  = "violetAreaGrad"

  // Donut data
  const donutData = sanctionsByAction.map((s) => ({
    name: s.action.charAt(0).toUpperCase() + s.action.slice(1),
    value: s.count,
    color: ACTION_COLORS[s.action] ?? "#6B7280",
  }))
  const donutTotal = donutData.reduce((a, b) => a + b.value, 0)

  // Appeal totals
  const appealTotal = appealStatuses.reduce((a, b) => a + b.count, 0)

  // Ticket resolution %
  const resolutionPct = ticketStats.total > 0
    ? Math.round((ticketStats.closed / ticketStats.total) * 100)
    : 0
  const circumference = 2 * Math.PI * 36
  const dashOffset = circumference - (resolutionPct / 100) * circumference

  return (
    <div className="dashboard-chart-panel grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

      {/* Donut — sanctions breakdown */}
      <ChartCard title={strings.sanctionsBreakdown} subtitle={strings.sanctionsBreakdownSub}>
        {donutData.length === 0 ? (
          <div className="h-44 flex items-center justify-center text-sm text-text-muted">{strings.noData}</div>
        ) : (
          <div className="relative flex items-center gap-4">
            <div className="w-40 h-40 shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={38}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {donutData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-display">{donutTotal}</span>
                <span className="text-[10px] text-text-muted uppercase tracking-wide">total</span>
              </div>
            </div>
            <div className="space-y-2 flex-1 min-w-0">
              {donutData.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
                  <span className="text-xs text-text-muted truncate">{entry.name}</span>
                  <span className="text-xs font-semibold ml-auto">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </ChartCard>

      {/* Area — daily activity */}
      <ChartCard title={strings.activityTimeline} subtitle={strings.activityTimelineSub}>
        {dailyActivity.length === 0 ? (
          <div className="h-44 flex items-center justify-center text-sm text-text-muted">{strings.noData}</div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={dailyActivity} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id={areaGradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={violetFill} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={violetFill} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => {
                  const d = new Date(v)
                  return `${d.getMonth() + 1}/${d.getDate()}`
                }}
                tick={{ fill: tickFill, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: tickFill, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke={violetFill}
                strokeWidth={2}
                fill={`url(#${areaGradId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Appeal status bars */}
      <ChartCard title={strings.appealStatus} subtitle="All time">
        {appealTotal === 0 ? (
          <div className="h-24 flex items-center justify-center text-sm text-text-muted">{strings.noData}</div>
        ) : (
          <div className="space-y-3">
            {appealStatuses.map((a, i) => {
              const key = a.status ?? "open"
              const colors = APPEAL_COLORS[key] ?? APPEAL_COLORS.open
              const pct = Math.round((a.count / appealTotal) * 100)
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className={`font-semibold capitalize ${colors.text}`}>{key}</span>
                    <span className="text-text-muted">{a.count} <span className="opacity-50">/ {appealTotal}</span></span>
                  </div>
                  <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors.bar} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ChartCard>

      {/* Ticket resolution gauge */}
      <ChartCard title={strings.ticketResolution} subtitle={strings.ticketResolutionSub}>
        <div className="flex items-center gap-6">
          {/* SVG arc gauge */}
          <div className="relative shrink-0 w-28 h-28">
            <svg viewBox="0 0 84 84" className="w-28 h-28 -rotate-90">
              {/* Track */}
              <circle
                cx="42" cy="42" r="36"
                fill="none"
                stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
                strokeWidth="7"
              />
              {/* Progress */}
              <circle
                cx="42" cy="42" r="36"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold font-display text-accent-secondary">{resolutionPct}%</span>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <div>
              <p className="text-xs text-text-muted">Total (30d)</p>
              <p className="text-lg font-bold">{ticketStats.total}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">{strings.resolved}</p>
              <p className="text-lg font-bold text-accent-secondary">{ticketStats.closed}</p>
            </div>
          </div>
        </div>
      </ChartCard>

    </div>
  )
}
