"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
    Check,
    ChevronRight,
    ChevronLeft,
    MapPin,
    Upload,
    X,
    Building2,
    ShieldCheck,
    Zap,
    Car,
    Eye,
    Lightbulb,
    Droplets,
    Camera,
    Loader2,
    Image as ImageIcon,
    AlertTriangle,
    Trash2,
    Pencil
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { MapboxLocationPicker } from "@/src/components/MapboxLocationPicker"
import { mockGarages } from "@/src/mock/garages"

// We will use existing Alert Dialog from ui/alert-dialog if available
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const amenitiesList = [
    { id: "covered", label: "Covered Parking", icon: Building2 },
    { id: "cctv", label: "CCTV Security", icon: Camera },
    { id: "24/7", label: "24/7 Access", icon: Eye },
    { id: "ev-charging", label: "EV Charging", icon: Zap },
    { id: "accessible", label: "Disability Access", icon: Car },
    { id: "security", label: "Security Guard", icon: ShieldCheck },
    { id: "lighting", label: "Well Lit", icon: Lightbulb },
    { id: "car-wash", label: "Car Wash", icon: Droplets },
]

export default function EditGaragePage() {
    const router = useRouter()
    const params = useParams()
    const { garageId } = params as { garageId: string }

    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Pre-fill with mock data if id matches, otherwise use default
    const existingGarage = mockGarages.find(g => g.id === garageId) || mockGarages[0]

    const [formData, setFormData] = useState({
        name: existingGarage.name || "",
        description: "Premium parking facility located conveniently in the city center. Fast access and secure environment.",
        address: existingGarage.address || "",
        city: existingGarage.city || "",
        phone: "+213 555 123 456",
        lat: 36.7525,
        lng: 3.04197,
        amenities: existingGarage.amenities || [] as string[],
        photos: [existingGarage.image || ""] as string[],
    })

    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        // If photos is empty or contains empty strings due to mock, fix it
        if (formData.photos.length === 1 && !formData.photos[0]) {
            setFormData(prev => ({ ...prev, photos: ["/images/garages/garage-1.jpg"] }))
        }
    }, [formData.photos])

    // Basic validation per step
    const canGoNext = () => {
        if (step === 1) return formData.name && formData.address && formData.city
        if (step === 2) return formData.lat && formData.lng
        if (step === 3) return formData.amenities.length > 0
        if (step === 4) return formData.photos.length > 0
        return true
    }

    const handleNext = () => {
        if (canGoNext() && step < 5) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleAmenityToggle = (id: string) => {
        if (formData.amenities.includes(id)) {
            setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== id) })
        } else {
            setFormData({ ...formData, amenities: [...formData.amenities, id] })
        }
    }

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newUrls = Array.from(e.target.files).map(f => URL.createObjectURL(f))
            setFormData({ ...formData, photos: [...formData.photos, ...newUrls] })
        }
    }

    const removePhoto = (index: number) => {
        const newPhotos = [...formData.photos]
        newPhotos.splice(index, 1)
        setFormData({ ...formData, photos: newPhotos })
    }

    const handleGeocode = async () => {
        const query = searchQuery || `${formData.address}, ${formData.city}`
        if (!query.trim()) return

        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
        if (!token) {
            toast.error("Mapbox token is missing. Please add it to your .env.local file.")
            return
        }

        setIsSearching(true)
        try {
            const res = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(query)}&access_token=${token}`)
            const data = await res.json()
            if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].geometry.coordinates
                setFormData(prev => ({ ...prev, lat, lng }))
                toast.success("Location found and map updated.")
            } else {
                toast.error("Location not found. Please try a different search term.")
            }
        } catch (error) {
            console.error("Geocoding error:", error)
            toast.error("Failed to search location.")
        } finally {
            setIsSearching(false)
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast("Garage Updated!", {
            description: "Looking good! Your changes have been saved.",
        })
        router.push("/garages")
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast("Garage Deleted", {
            description: "Your garage has been permanently removed.",
        })
        router.push("/garages")
    }

    const progress = (step / 5) * 100

    return (
        <div className="flex-1 max-w-4xl mx-auto w-full space-y-8 p-8 pt-6 pb-24">
            <div className="space-y-2">
                <div className="flex justify-between items-center bg-card p-4 border rounded-xl mb-6">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild className="h-8 group">
                            <Link href="/garages">
                                <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Back
                            </Link>
                        </Button>
                        <h2 className="text-xl font-bold tracking-tight">Edit Garage</h2>
                    </div>
                    <div className="text-sm font-medium bg-muted px-3 py-1 rounded-full">
                        Step {step} of 5
                    </div>
                </div>
                <Progress value={progress} className="h-2 w-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Steps */}
                <div className="hidden md:block col-span-1 space-y-4">
                    {[
                        { num: 1, title: "Basic Info" },
                        { num: 2, title: "Location" },
                        { num: 3, title: "Amenities" },
                        { num: 4, title: "Photos" },
                        { num: 5, title: "Review" },
                    ].map((s) => (
                        <div
                            key={s.num}
                            className={`flex items-center gap-3 ${step === s.num ? "text-primary font-semibold" : step > s.num ? "text-foreground" : "text-muted-foreground"}`}
                        >
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step === s.num ? "border-primary bg-primary/10" : step > s.num ? "border-primary bg-primary text-primary-foreground" : "border-muted"}`}>
                                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                            </div>
                            <span className="text-sm">{s.title}</span>
                        </div>
                    ))}
                </div>

                {/* Form Area */}
                <div className="col-span-1 md:col-span-3">
                    <Card>
                        <CardContent className="p-6 sm:p-8 min-h-[400px]">
                            {step === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-semibold">Basic Information</h3>
                                        <p className="text-sm text-muted-foreground">Provide the primary details about your parking facility.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Garage Name <span className="text-destructive">*</span></Label>
                                            <Input
                                                id="name"
                                                placeholder="e.g. Downtown Central Plaza Parking"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Describe your garage's best features..."
                                                className="min-h-[100px]"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                                                <Input
                                                    id="city"
                                                    placeholder="e.g. Algiers"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Contact Phone</Label>
                                                <Input
                                                    id="phone"
                                                    placeholder="+213 555 123 456"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">Full Address <span className="text-destructive">*</span></Label>
                                            <Input
                                                id="address"
                                                placeholder="e.g. 123 Main Street"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-semibold">Precise Location</h3>
                                        <p className="text-sm text-muted-foreground">Pinpoint your exact garage entrance on the map.</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Search for your address..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    handleGeocode()
                                                }
                                            }}
                                        />
                                        <Button variant="secondary" onClick={handleGeocode} disabled={isSearching} type="button">
                                            {isSearching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="w-4 h-4 mr-2" />}
                                            Find
                                        </Button>
                                    </div>

                                    <MapboxLocationPicker
                                        latitude={formData.lat}
                                        longitude={formData.lng}
                                        onChange={(lat, lng) => setFormData({ ...formData, lat, lng })}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Latitude</Label>
                                            <Input value={formData.lat} readOnly className="bg-muted" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Longitude</Label>
                                            <Input value={formData.lng} readOnly className="bg-muted" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-semibold">Amenities</h3>
                                        <p className="text-sm text-muted-foreground">Select all features available at your facility.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border p-6 rounded-xl bg-card/50">
                                        {amenitiesList.map((amenity) => {
                                            const Icon = amenity.icon
                                            const isChecked = formData.amenities.includes(amenity.id)
                                            return (
                                                <div
                                                    key={amenity.id}
                                                    className={`flex items-center gap-3 space-x-2 border p-3 rounded-lg cursor-pointer transition-colors ${isChecked ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                                                    onClick={() => handleAmenityToggle(amenity.id)}
                                                >
                                                    <Checkbox checked={isChecked} onCheckedChange={() => handleAmenityToggle(amenity.id)} />
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`h-4 w-4 ${isChecked ? 'text-primary' : 'text-muted-foreground'}`} />
                                                        <Label className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            {amenity.label}
                                                        </Label>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-semibold">Garage Photos</h3>
                                        <p className="text-sm text-muted-foreground">Upload at least one high-quality image of the entrance and spots.</p>
                                    </div>

                                    {/* Drag & Drop Zone */}
                                    <div
                                        className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors rounded-xl p-12 flex flex-col items-center justify-center bg-muted/20 cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handlePhotoUpload}
                                        />
                                        <div className="p-4 bg-primary/10 rounded-full mb-4">
                                            <Upload className="h-8 w-8 text-primary" />
                                        </div>
                                        <p className="font-semibold text-base mb-1">Click or drag images here to upload</p>
                                        <p className="text-sm text-muted-foreground">JPG, PNG up to 10MB each</p>
                                    </div>

                                    {/* Photo Previews */}
                                    {formData.photos.length > 0 && (
                                        <div className="space-y-3">
                                            <Label>Uploaded Photos ({formData.photos.length})</Label>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                {formData.photos.map((photo, i) => {
                                                    // Handle string placeholder properly for next/image if it hasn't been mapped
                                                    const src = photo || "https://images.unsplash.com/photo-1590674899484-131c9bfad3bb?q=80&w=600&auto=format&fit=crop"
                                                    return (
                                                        <div key={i} className="group relative aspect-video bg-muted rounded-lg overflow-hidden border">
                                                            <img src={src} alt={`Preview ${i}`} className="absolute inset-0 w-full h-full object-cover" />
                                                            <button
                                                                onClick={() => removePhoto(i)}
                                                                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                            </button>
                                                            {i === 0 && (
                                                                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full shadow-sm">
                                                                    Cover Photo
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 5 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-semibold">Review & Submit</h3>
                                        <p className="text-sm text-muted-foreground">Verify your garage details before publishing.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-5 border rounded-xl bg-muted/10 space-y-4">
                                            {/* Name / Desc */}
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-lg">{formData.name}</h4>
                                                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                                                        <MapPin className="h-3.5 w-3.5 mr-1" /> {formData.address}, {formData.city}
                                                    </p>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => setStep(1)}><Pencil className="h-3.5 w-3.5 mr-2" /> Edit</Button>
                                            </div>

                                            {formData.description && (
                                                <p className="text-sm leading-relaxed">{formData.description}</p>
                                            )}

                                            <div className="pt-4 border-t flex flex-wrap gap-2">
                                                {formData.amenities.map(a => {
                                                    const label = amenitiesList.find(am => am.id === a)?.label
                                                    return label ? (
                                                        <div key={a} className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs rounded-full font-medium">
                                                            {label}
                                                        </div>
                                                    ) : null
                                                })}
                                                {formData.amenities.length > 0 && (
                                                    <Button variant="ghost" size="sm" className="h-6 text-xs ml-auto" onClick={() => setStep(3)}>Edit</Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-5 border rounded-xl bg-muted/10">
                                            <div className="flex justify-between items-start mb-3">
                                                <Label className="text-base font-semibold">Photos ({formData.photos.length})</Label>
                                                <Button variant="ghost" size="sm" onClick={() => setStep(4)}><Pencil className="h-3.5 w-3.5 mr-2" /> Edit</Button>
                                            </div>
                                            {formData.photos.length > 0 ? (
                                                <div className="flex space-x-3 overflow-x-auto pb-2">
                                                    {formData.photos.slice(0, 3).map((p, i) => (
                                                        <div key={i} className="relative h-20 w-32 rounded-md overflow-hidden shrink-0 border">
                                                            <img src={p || "https://images.unsplash.com/photo-1590674899484-131c9bfad3bb?q=80&w=600&auto=format&fit=crop"} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                    {formData.photos.length > 3 && (
                                                        <div className="h-20 w-32 rounded-md bg-muted flex items-center justify-center text-sm font-medium border shrink-0">
                                                            +{formData.photos.length - 3} more
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="h-20 w-32 rounded-md bg-muted flex items-center justify-center border shrink-0">
                                                    <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </CardContent>
                    </Card>

                    {/* Navigation Buttons for the form wizard */}
                    <div className="mt-8 flex justify-between">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={step === 1 || isSubmitting}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>

                        {step < 5 ? (
                            <Button
                                onClick={handleNext}
                                className="min-w-[120px]"
                                disabled={!canGoNext()}
                            >
                                Next Step
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                className="min-w-[160px]"
                                disabled={isSubmitting || isDeleting}
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                                ) : (
                                    <><Check className="w-4 h-4 mr-2" /> Save Changes</>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Danger Zone Section ONLY visible when loaded. And only if step 5 review isn't obscuring it (actually show it globally at the bottom on edit page) */}
            <div className="mt-16 pt-8 border-t border-destructive/20 border-dashed">
                <Card className="border-destructive bg-destructive/5">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Danger Zone
                        </CardTitle>
                        <CardDescription className="text-destructive/80">
                            Permanently delete your garage. This action cannot be undone and will remove all associated spots and future bookings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Garage
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete
                                        "{formData.name}" and remove all data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                        Yes, delete garage
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}
