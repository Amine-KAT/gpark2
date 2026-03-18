"use client"

import { Navbar } from "@/src/components/layout/navbar"
import { Footer } from "@/src/components/layout/footer"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
