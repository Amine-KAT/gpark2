"use client"

import Link from "next/link"
import {
  Building2,
  Car,
  CreditCard,
  CalendarCheck,
  TrendingUp,
  TrendingDown,
  Plus,
  Settings,
  Download
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { AreaCharts } from "@/src/components/booking/area-charts"
import {
  sessionsChartData,
  revenueChartData,
} from "@/src/mock/dashboard"

const recentBookings = [
  { id: "b1", client: "Alex M.", garage: "Downtown P1", spot: "A-12", date: "2026-03-18", amount: 1200, status: "Active" },
  { id: "b2", client: "Sarah K.", garage: "Airport Long-Term", spot: "L-05", date: "2026-03-18", amount: 4500, status: "Completed" },
  { id: "b3", client: "John D.", garage: "Tech Park", spot: "B-22", date: "2026-03-19", amount: 800, status: "Upcoming" },
  { id: "b4", client: "Emma W.", garage: "Westside Mall", spot: "C-01", date: "2026-03-17", amount: 600, status: "Completed" },
  { id: "b5", client: "Michael R.", garage: "Downtown P1", spot: "A-15", date: "2026-03-20", amount: 1500, status: "Upcoming" },
]

export default function HostDashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/host/garages/new">
              <Plus className="mr-2 h-4 w-4" /> Add New Garage
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/host/garages">
              <Settings className="mr-2 h-4 w-4" /> Manage Spots
            </Link>
          </Button>
          <Button variant="secondary">
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Garages</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium mr-1">+1</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spots</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,450</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium mr-1">+150</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68,000 DZD</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium mr-1">+15%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">611</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingDown className="mr-1 h-3 w-3 text-rose-500" />
              <span className="text-rose-500 font-medium mr-1">-2%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <AreaCharts
          sessionsData={sessionsChartData}
          revenueData={revenueChartData}
        />
      </div>

      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              A list of the latest spots booked by clients.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/host/bookings">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Garage</TableHead>
                <TableHead>Spot</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.client}</TableCell>
                  <TableCell>{booking.garage}</TableCell>
                  <TableCell>{booking.spot}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell className="text-right">{booking.amount.toLocaleString()} DZD</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.status === "Completed" ? "secondary" :
                          booking.status === "Active" ? "default" : "outline"
                      }
                      className={booking.status === "Active" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-none border-emerald-500/20" : ""}
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
