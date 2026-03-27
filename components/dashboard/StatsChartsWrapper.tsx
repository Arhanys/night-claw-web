"use client"

import dynamic from "next/dynamic"
import type { SanctionByAction, DailyActivity, AppealStatus, TicketStats } from "./StatsCharts"

const StatsCharts = dynamic(() => import("./StatsCharts"), { ssr: false })

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

export default function StatsChartsWrapper(props: Props) {
  return <StatsCharts {...props} />
}
