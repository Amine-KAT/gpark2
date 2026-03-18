"use client"

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Card } from "@/components/ui/card"
import type { ChartDataPoint } from "@/src/mock/dashboard"

const CHART_BLUE = "oklch(0.55 0.2 250)"
const CHART_BLUE_LIGHT = "oklch(0.55 0.2 250 / 0.15)"

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
  prefix?: string
  suffix?: string
}

function CustomTooltip({
  active,
  payload,
  label,
  prefix = "",
  suffix = "",
}: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-foreground px-3 py-2 shadow-lg">
        <p className="text-sm font-bold text-background">
          {prefix}
          {payload[0].value.toLocaleString()}
          {suffix}
        </p>
        <p className="text-xs text-background/70">Day {label}</p>
      </div>
    )
  }
  return null
}

interface ChartCardProps {
  title: string
  subtitle: string
  data: ChartDataPoint[]
  prefix?: string
  suffix?: string
  yTickFormatter?: (value: number) => string
}

function ChartCard({
  title,
  subtitle,
  data,
  prefix,
  suffix,
  yTickFormatter,
}: ChartCardProps) {
  const gradientId = `gradient-${title.replace(/\s+/g, "-")}`

  return (
    <Card className="border border-border bg-card p-6 shadow-none">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.2} />
                <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={CHART_BLUE_LIGHT}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "oklch(0.5 0.015 250)" }}
              tickLine={false}
              axisLine={false}
              interval={1}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "oklch(0.5 0.015 250)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={yTickFormatter}
            />
            <Tooltip
              content={<CustomTooltip prefix={prefix} suffix={suffix} />}
              cursor={{ stroke: CHART_BLUE, strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={CHART_BLUE}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{
                r: 5,
                fill: CHART_BLUE,
                stroke: "oklch(1 0 0)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

interface AreaChartsProps {
  sessionsData: ChartDataPoint[]
  revenueData: ChartDataPoint[]
}

export function AreaCharts({ sessionsData, revenueData }: AreaChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard
        title="Parking Sessions"
        subtitle="Last 30 days"
        data={sessionsData}
      />
      <ChartCard
        title="Revenue Trend"
        subtitle="Last 30 days"
        data={revenueData}
        prefix="$"
        yTickFormatter={(value: number) =>
          value >= 1000 ? `$${(value / 1000).toFixed(0)}K` : `$${value}`
        }
      />
    </div>
  )
}
