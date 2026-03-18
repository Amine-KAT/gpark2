"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { StatData } from "@/src/mock/dashboard"

interface StatCardProps extends StatData {}

function StatCard({ title, value, change, prefix }: StatCardProps) {
  const isPositive = change >= 0

  return (
    <Card className="flex flex-col gap-2 border border-border bg-card p-6 shadow-none">
      <span className="text-sm font-medium text-muted-foreground">{title}</span>
      <span className="text-3xl font-bold tracking-tight text-card-foreground lg:text-4xl">
        {prefix}
        {value}
      </span>
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="h-3.5 w-3.5 text-success" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-destructive" />
        )}
        <span
          className={`text-sm font-semibold ${
            isPositive ? "text-success" : "text-destructive"
          }`}
        >
          {isPositive ? "+" : ""}
          {change}%
        </span>
      </div>
    </Card>
  )
}

interface StatCardsProps {
  stats: StatData[]
}

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
