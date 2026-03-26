"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
    Building2,
    MapPin,
    Star,
    Car,
    Banknote,
    Plus,
    Pencil,
    Settings,
    CalendarCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { mockGarages } from "@/src/mock/garages"

export default function MyGaragesPage() {
    const [garages, setGarages] = useState(
        mockGarages.slice(0, 3).map(g => ({ ...g, isActive: true, monthlyRevenue: Math.floor(Math.random() * 50000) + 10000 }))
    )

    const toggleStatus = (id: string) => {
        setGarages(garages.map(g => g.id === id ? { ...g, isActive: !g.isActive } : g))
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Garages</h2>
                    <p className="text-muted-foreground mt-1">Manage your listed parking facilities and spots.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button asChild>
                        <Link href="/garages/new">
                            <Plus className="mr-2 h-4 w-4" /> Add New Garage
                        </Link>
                    </Button>
                </div>
            </div>

            {garages.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed bg-card/50">
                    <Building2 className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <h3 className="text-xl font-semibold">No garages found</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                        You haven't listed any garages yet. Add your first garage to start earning.
                    </p>
                    <Button className="mt-6" asChild>
                        <Link href="/garages/new">
                            <Plus className="mr-2 h-4 w-4" /> Add New Garage
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {garages.map((garage) => (
                        <Card key={garage.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                {/* Thumbnail */}
                                <div className="relative h-48 md:h-auto md:w-72 bg-muted shrink-0">
                                    <div className="absolute inset-0 w-full h-full bg-muted flex items-center justify-center">
                                        <Building2 className="h-10 w-10 text-muted-foreground/30" />
                                    </div>
                                    {/* Note: In a real app we'd use next/image with the real URL. We skip error-throwing unconfigured domains if any. */}
                                    {/* Using standard img for placeholder if the mock image fails or isn't next configured */}
                                    <img
                                        src={garage.image || "/images/garages/garage-1.jpg"}
                                        alt={garage.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://images.unsplash.com/photo-1590674899484-131c9bfad3bb?q=80&w=600&auto=format&fit=crop"
                                        }}
                                    />
                                    {!garage.isActive && (
                                        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                                            <Badge variant="secondary" className="font-semibold text-sm">Inactive</Badge>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 flex-col justify-between p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/garages/${garage.id}`} className="font-semibold text-xl hover:underline">
                                                    {garage.name}
                                                </Link>
                                                {garage.isActive ? (
                                                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 border shadow-none">Active</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <MapPin className="mr-1 h-3.5 w-3.5" />
                                                {garage.address}, {garage.city}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 pt-3 text-sm">
                                                <div className="flex items-center text-foreground font-medium">
                                                    <Car className="mr-1.5 h-4 w-4 text-muted-foreground" />
                                                    {garage.totalSpots} Spots
                                                </div>
                                                <div className="flex items-center text-foreground font-medium">
                                                    <Star className="mr-1.5 h-4 w-4 text-amber-500 fill-amber-500" />
                                                    {garage.rating} ({garage.reviewCount})
                                                </div>
                                                <div className="flex items-center text-foreground font-medium">
                                                    <Banknote className="mr-1.5 h-4 w-4 text-emerald-500" />
                                                    {garage.monthlyRevenue.toLocaleString()} DZD / month
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-muted-foreground mr-2">Status</span>
                                            <Switch
                                                checked={garage.isActive}
                                                onCheckedChange={() => toggleStatus(garage.id)}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/garages/${garage.id}`}>
                                                <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/garages/${garage.id}/spots`}>
                                                <Settings className="mr-2 h-3.5 w-3.5" /> Manage Spots
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/garages/${garage.id}/bookings`}>
                                                <CalendarCheck className="mr-2 h-3.5 w-3.5" /> View Bookings
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
