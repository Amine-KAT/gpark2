"use client"

import { useEffect, useMemo, useState } from "react"
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox"
import type { CSSProperties } from "react"
import { Star, MapPin } from "lucide-react"
import "mapbox-gl/dist/mapbox-gl.css"

import { mockGarages, type Garage } from "@/src/mock/garages"

type GarageWithCoords = Garage & {
  latitude: number
  longitude: number
}

function getGarageGeocodeQuery(g: Garage) {
  return `${g.address}, ${g.city}`
}

async function geocodeGarage(query: string, token: string) {
  const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
    query
  )}&access_token=${token}&limit=1`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`)
  const data = (await res.json()) as any
  const coords = data?.features?.[0]?.geometry?.coordinates
  if (!coords?.length) throw new Error("No geocode results")
  const [lng, lat] = coords
  if (typeof lng !== "number" || typeof lat !== "number") throw new Error("Invalid coords")
  return { latitude: lat, longitude: lng }
}

export function AirbnbExploreMap() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string | undefined

  const [viewState, setViewState] = useState({
    longitude: 3.04197, // Algiers default
    latitude: 36.7525,
    zoom: 13,
  })

  const [garagesWithCoords, setGaragesWithCoords] = useState<GarageWithCoords[]>([])
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [selectedGarageId, setSelectedGarageId] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    const cacheKey = "parkEase_mapbox_geocode_cache_v1"
    const cached = (() => {
      try {
        const raw = window.sessionStorage.getItem(cacheKey)
        if (!raw) return null
        const parsed = JSON.parse(raw) as Record<string, { latitude: number; longitude: number }>
        return parsed
      } catch {
        return null
      }
    })()

    let cancelled = false
    const run = async () => {
      const initial: GarageWithCoords[] = []
      const toGeocode: Garage[] = []
      let didSetSelectionFromInitial = false

      for (const g of mockGarages) {
        const coords = cached?.[g.id]
        if (coords && typeof coords.latitude === "number" && typeof coords.longitude === "number") {
          initial.push({ ...g, ...coords })
        } else {
          toGeocode.push(g)
        }
      }

      if (!cancelled) setGaragesWithCoords(initial)

      if (initial.length > 0) {
        const avgLat = initial.reduce((sum, g) => sum + g.latitude, 0) / initial.length
        const avgLng = initial.reduce((sum, g) => sum + g.longitude, 0) / initial.length

        setViewState((prev) => ({
          ...prev,
          latitude: avgLat,
          longitude: avgLng,
          zoom: Math.max(prev.zoom, 12),
        }))

        const featured = initial.find((g) => g.isFeatured)
        setSelectedGarageId(featured?.id ?? initial[0].id)
        didSetSelectionFromInitial = true
      }

      if (toGeocode.length === 0) return

      setIsGeocoding(true)
      try {
        const results = await Promise.all(
          toGeocode.map(async (g) => {
            const query = getGarageGeocodeQuery(g)
            try {
              const coords = await geocodeGarage(query, token)
              return { ...g, ...coords } satisfies GarageWithCoords
            } catch {
              return null
            }
          })
        )

        const filtered = results.filter(Boolean) as GarageWithCoords[]
        if (cancelled) return

        const combined = [...initial, ...filtered]
        setGaragesWithCoords(combined)

        const mergedForCache: Record<string, { latitude: number; longitude: number }> = {
          ...(cached ?? {}),
        }
        for (const g of filtered) {
          mergedForCache[g.id] = { latitude: g.latitude, longitude: g.longitude }
        }
        window.sessionStorage.setItem(cacheKey, JSON.stringify(mergedForCache))

        const featured = combined.find((g) => g.isFeatured)
        if (!didSetSelectionFromInitial) setSelectedGarageId(featured?.id ?? combined[0].id)

        const avgLat = combined.reduce((sum, g) => sum + g.latitude, 0) / combined.length
        const avgLng = combined.reduce((sum, g) => sum + g.longitude, 0) / combined.length
        setViewState((prev) => ({
          ...prev,
          latitude: avgLat,
          longitude: avgLng,
          zoom: Math.max(prev.zoom, 12),
        }))
      } finally {
        if (!cancelled) setIsGeocoding(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [token])

  const sortedGarages = useMemo(() => {
    const copy = [...garagesWithCoords]
    copy.sort((a, b) => {
      const featuredDelta = Number(b.isFeatured) - Number(a.isFeatured)
      if (featuredDelta !== 0) return featuredDelta
      return b.rating - a.rating
    })
    return copy
  }, [garagesWithCoords])

  const selectedGarage = useMemo(() => {
    return sortedGarages.find((g) => g.id === selectedGarageId) ?? null
  }, [sortedGarages, selectedGarageId])

  const mapStyle: CSSProperties = { width: "100%", height: "100%" }

  const selectGarage = (g: GarageWithCoords) => {
    setSelectedGarageId(g.id)
    // Pan the camera to the selected garage (Airbnb-style).
    setViewState((prev) => ({
      ...prev,
      latitude: g.latitude,
      longitude: g.longitude,
      zoom: Math.max(prev.zoom, 14),
    }))
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Full-screen Map */}
      <div className="fixed inset-0 -z-10">
        {token ? (
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={token}
            style={mapStyle}
          >
            <NavigationControl position="top-right" />

            {garagesWithCoords.map((g) => {
              const selected = g.id === selectedGarageId
              return (
                <Marker key={g.id} longitude={g.longitude} latitude={g.latitude} anchor="bottom">
                  <button
                    type="button"
                    aria-label={`Select ${g.name}`}
                    onClick={() => selectGarage(g)}
                    className={[
                      "group rounded-full border bg-background/90 backdrop-blur shadow-sm transition",
                      selected
                        ? "border-primary/40 ring-2 ring-primary/30 scale-110"
                        : "border-border hover:border-primary/40 hover:scale-105",
                    ].join(" ")}
                    style={{
                      width: 44,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MapPin
                      className={selected ? "h-7 w-7 fill-primary text-primary" : "h-6 w-6 text-muted-foreground"}
                    />
                  </button>
                </Marker>
              )
            })}
          </Map>
        ) : (
          <div className="absolute inset-0 bg-muted/20 flex items-center justify-center p-6">
            <div className="max-w-md text-center space-y-2">
              <div className="mx-auto h-12 w-12 rounded-full bg-background border flex items-center justify-center">
                <MapPin className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Mapbox Token Missing</h3>
              <p className="text-sm text-muted-foreground">
                Please add <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">NEXT_PUBLIC_MAPBOX_TOKEN</code> to your{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">.env.local</code>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom sheet cards (Airbnb-like) */}
      <div className="fixed inset-x-0 bottom-0 z-10 pointer-events-none pb-4">
        <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 pointer-events-auto">
          <div className="rounded-2xl border bg-background/85 backdrop-blur shadow-lg overflow-hidden">
            <div className="flex items-center justify-between gap-4 p-4 border-b">
              <div className="space-y-0.5">
                <div className="text-base font-semibold tracking-tight">Available garages</div>
                <div className="text-sm text-muted-foreground">
                  {isGeocoding ? "Loading map pins..." : `${sortedGarages.length} listings nearby`}
                </div>
              </div>

              {selectedGarage ? (
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    {selectedGarage.rating.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span>
                    {selectedGarage.availableSpots} spots left
                  </span>
                </div>
              ) : null}
            </div>

            <div className="max-h-[58vh] overflow-y-auto p-4 space-y-3">
              {sortedGarages.map((g) => {
                const selected = g.id === selectedGarageId
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => selectGarage(g)}
                    className={[
                      "w-full text-left rounded-2xl border bg-card/70 hover:bg-card transition overflow-hidden",
                      selected ? "ring-2 ring-primary/30 border-primary/30" : "border-border/60",
                    ].join(" ")}
                  >
                    <div className="flex gap-4 p-3 sm:p-4">
                      <div className="relative h-24 w-[132px] shrink-0 overflow-hidden rounded-xl">
                        <img
                          src={g.image}
                          alt={g.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/images/garages/garage-1.jpg"
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-semibold text-sm sm:text-base truncate">{g.name}</div>
                            <div className="text-xs text-muted-foreground truncate mt-0.5">
                              {g.address}, {g.city}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-amber-500">
                            <Star className="h-4 w-4 fill-amber-500" />
                            <span className="text-sm font-medium">{g.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          <div className="text-sm font-medium">
                            {g.availableSpots} spots left
                          </div>
                          <div className="text-sm text-muted-foreground">
                            • {g.totalSpots} total
                          </div>
                          {g.isFeatured ? (
                            <div className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">
                              Featured
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            from
                          </div>
                          <div className="text-sm sm:text-base font-semibold">
                            {g.pricePerHour} DZD <span className="text-xs font-medium text-muted-foreground">/ hour</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}

              {token && !isGeocoding && sortedGarages.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Could not load any map pins. Check your Mapbox token and try again.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

