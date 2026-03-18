"use client"

import { HostSidebar, HostMobileNav } from "@/src/components/layout/sidebar"

export default function HostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <HostSidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile top nav */}
        <HostMobileNav />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
