"use client"

import { useState, useCallback, useEffect } from "react"
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox"
import { MapPin } from "lucide-react"

import "mapbox-gl/dist/mapbox-gl.css"

interface MapboxLocationPickerProps {
    latitude: number
    longitude: number
    onChange: (lat: number, lng: number) => void
}

export function MapboxLocationPicker({
    latitude,
    longitude,
    onChange,
}: MapboxLocationPickerProps) {
    const [viewState, setViewState] = useState({
        longitude: longitude || 3.04197, // Algiers default
        latitude: latitude || 36.7525,
        zoom: 13,
    })

    // When external lat/lng changes drastically (e.g. from address search), update camera slightly
    useEffect(() => {
        setViewState((prev) => ({
            ...prev,
            longitude,
            latitude,
        }))
    }, [latitude, longitude])

    const onMarkerDragEnd = useCallback((event: any) => {
        const { lng, lat } = event.lngLat
        onChange(lat, lng)
    }, [onChange])

    return (
        <div className="w-full h-[300px] overflow-hidden rounded-xl border relative shadow-sm">
            <Map
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                style={{ width: "100%", height: "100%" }}
            >
                <NavigationControl position="bottom-right" />
                <Marker
                    longitude={longitude || 3.04197}
                    latitude={latitude || 36.7525}
                    draggable
                    onDragEnd={onMarkerDragEnd}
                >
                    <div className="transform -translate-x-1/2 -translate-y-full cursor-pointer animate-in zoom-in-50 duration-300">
                        <MapPin className="w-10 h-10 fill-primary text-primary-foreground drop-shadow-md" />
                    </div>
                </Marker>
            </Map>

            {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center">
                    <MapPin className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold">Mapbox Token Missing</h3>
                    <p className="text-muted-foreground text-sm max-w-[300px] mt-2">
                        Please add <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">NEXT_PUBLIC_MAPBOX_TOKEN</code> to your <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">.env.local</code> file to enable the interactive map.
                    </p>
                </div>
            )}
        </div>
    )
}
