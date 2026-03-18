"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Car,
  LayoutDashboard,
  Building,
  CalendarDays,
  DollarSign,
  Settings,
  ArrowRightLeft,
  LogOut,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuthStore } from "@/src/store/auth-store"
import { cn } from "@/lib/utils"

const sidebarNavItems = [
  { label: "Dashboard", href: "/host", icon: LayoutDashboard },
  { label: "My Garages", href: "/host/garages", icon: Building },
  { label: "Bookings", href: "/host/bookings", icon: CalendarDays },
  { label: "Earnings", href: "/host/earnings", icon: DollarSign },
  { label: "Settings", href: "/host/settings", icon: Settings },
]

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, switchRole, logout } = useAuthStore()

  const handleSwitchToClient = () => {
    switchRole()
    onNavigate?.()
    router.push("/explore")
  }

  const handleLogout = () => {
    logout()
    onNavigate?.()
    router.push("/login")
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Car className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">
          ParkEase
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {sidebarNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/host" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section: user */}
      <div className="mt-auto px-3 pb-4">
        <Separator className="mb-4" />
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {currentUser?.initials ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium text-foreground">
              {currentUser?.name ?? "User"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {currentUser?.email ?? ""}
            </p>
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-1">
          <button
            type="button"
            onClick={handleSwitchToClient}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Switch to Client
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

/** Desktop sidebar - fixed left column */
export function HostSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card lg:block">
      <div className="sticky top-0 h-screen overflow-y-auto">
        <SidebarNav />
      </div>
    </aside>
  )
}

/** Mobile top bar with sheet drawer for host pages */
export function HostMobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
      <Link href="/host" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Car className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-base font-bold tracking-tight text-foreground">
          ParkEase
        </span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
