import { Download } from "lucide-react"
import { StatCards } from "@/src/components/booking/stat-cards"
import { AreaCharts } from "@/src/components/booking/area-charts"
import {
  dashboardStats,
  sessionsChartData,
  revenueChartData,
} from "@/src/mock/dashboard"

export default function HostDashboardPage() {
  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <button
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          type="button"
        >
          Export data
          <Download className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex flex-col gap-6">
        <StatCards stats={dashboardStats} />
        <AreaCharts
          sessionsData={sessionsChartData}
          revenueData={revenueChartData}
        />
      </div>
    </>
  )
}
