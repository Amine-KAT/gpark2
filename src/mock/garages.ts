export type SpotType = "compact" | "suv" | "motorcycle" | "van"

export type Amenity = "covered" | "24/7" | "cctv" | "ev-charging" | "valet" | "accessible"

export interface GarageReview {
  id: string
  userName: string
  userInitials: string
  rating: number
  comment: string
  date: string
}

export interface Garage {
  id: string
  name: string
  address: string
  city: string
  image: string
  rating: number
  reviewCount: number
  pricePerHour: number
  spotTypes: SpotType[]
  amenities: Amenity[]
  totalSpots: number
  availableSpots: number
  isFeatured: boolean
}

export const amenityLabels: Record<Amenity, string> = {
  covered: "Covered",
  "24/7": "24/7 Access",
  cctv: "CCTV",
  "ev-charging": "EV Charging",
  valet: "Valet",
  accessible: "Accessible",
}

export const spotTypeLabels: Record<SpotType, string> = {
  compact: "Compact",
  suv: "SUV",
  motorcycle: "Motorcycle",
  van: "Van",
}

export const mockGarages: Garage[] = [
  {
    id: "g1",
    name: "Downtown Central Garage",
    address: "123 Main St, Downtown",
    city: "New York",
    image: "/images/garages/garage-1.jpg",
    rating: 4.8,
    reviewCount: 324,
    pricePerHour: 8,
    spotTypes: ["compact", "suv", "motorcycle"],
    amenities: ["covered", "24/7", "cctv", "ev-charging"],
    totalSpots: 450,
    availableSpots: 127,
    isFeatured: true,
  },
  {
    id: "g2",
    name: "Riverside Office Park",
    address: "456 River Rd, Midtown",
    city: "New York",
    image: "/images/garages/garage-2.jpg",
    rating: 4.5,
    reviewCount: 186,
    pricePerHour: 5,
    spotTypes: ["compact", "suv", "van"],
    amenities: ["24/7", "cctv", "accessible"],
    totalSpots: 320,
    availableSpots: 89,
    isFeatured: true,
  },
  {
    id: "g3",
    name: "Metro Underground Parking",
    address: "789 Subway Ave, Financial District",
    city: "Chicago",
    image: "/images/garages/garage-3.jpg",
    rating: 4.7,
    reviewCount: 215,
    pricePerHour: 12,
    spotTypes: ["compact", "suv"],
    amenities: ["covered", "cctv", "ev-charging", "valet"],
    totalSpots: 600,
    availableSpots: 203,
    isFeatured: true,
  },
  {
    id: "g4",
    name: "Green Tower Parking",
    address: "321 Eco Blvd, Uptown",
    city: "San Francisco",
    image: "/images/garages/garage-4.jpg",
    rating: 4.9,
    reviewCount: 412,
    pricePerHour: 15,
    spotTypes: ["compact", "suv", "motorcycle", "van"],
    amenities: ["covered", "24/7", "cctv", "ev-charging", "valet", "accessible"],
    totalSpots: 800,
    availableSpots: 54,
    isFeatured: true,
  },
  {
    id: "g5",
    name: "Skyview Rooftop Parking",
    address: "555 Skyline Dr, Heights",
    city: "Los Angeles",
    image: "/images/garages/garage-5.jpg",
    rating: 4.3,
    reviewCount: 98,
    pricePerHour: 6,
    spotTypes: ["compact", "suv"],
    amenities: ["cctv", "24/7"],
    totalSpots: 200,
    availableSpots: 67,
    isFeatured: false,
  },
  {
    id: "g6",
    name: "Airport Long-Term Lot",
    address: "1 Airport Way, Terminal District",
    city: "Miami",
    image: "/images/garages/garage-6.jpg",
    rating: 4.1,
    reviewCount: 543,
    pricePerHour: 4,
    spotTypes: ["compact", "suv", "van"],
    amenities: ["covered", "cctv", "accessible"],
    totalSpots: 1200,
    availableSpots: 401,
    isFeatured: false,
  },
  {
    id: "g7",
    name: "Westside Mall Garage",
    address: "900 Commerce Way, Westside",
    city: "Boston",
    image: "/images/garages/garage-1.jpg",
    rating: 4.4,
    reviewCount: 178,
    pricePerHour: 7,
    spotTypes: ["compact", "suv", "motorcycle"],
    amenities: ["covered", "cctv", "accessible"],
    totalSpots: 350,
    availableSpots: 112,
    isFeatured: false,
  },
  {
    id: "g8",
    name: "Harbor View Parking",
    address: "200 Waterfront St, Harbor",
    city: "Seattle",
    image: "/images/garages/garage-2.jpg",
    rating: 4.6,
    reviewCount: 231,
    pricePerHour: 9,
    spotTypes: ["compact", "suv", "van"],
    amenities: ["24/7", "cctv", "ev-charging"],
    totalSpots: 400,
    availableSpots: 156,
    isFeatured: false,
  },
  {
    id: "g9",
    name: "University Campus Parking",
    address: "50 College Ave, University District",
    city: "Austin",
    image: "/images/garages/garage-3.jpg",
    rating: 3.9,
    reviewCount: 89,
    pricePerHour: 3,
    spotTypes: ["compact", "motorcycle"],
    amenities: ["cctv"],
    totalSpots: 250,
    availableSpots: 78,
    isFeatured: false,
  },
  {
    id: "g10",
    name: "Tech Park Premium Garage",
    address: "1000 Innovation Dr, Tech Park",
    city: "San Jose",
    image: "/images/garages/garage-4.jpg",
    rating: 4.8,
    reviewCount: 367,
    pricePerHour: 14,
    spotTypes: ["compact", "suv", "motorcycle", "van"],
    amenities: ["covered", "24/7", "cctv", "ev-charging", "valet"],
    totalSpots: 700,
    availableSpots: 189,
    isFeatured: false,
  },
]

export const mockTestimonials = [
  {
    id: "t1",
    name: "Sarah Mitchell",
    initials: "SM",
    rating: 5,
    comment:
      "ParkEase has completely changed how I deal with parking in the city. I used to circle blocks for 20 minutes -- now I just book ahead and walk right in.",
  },
  {
    id: "t2",
    name: "David Chen",
    initials: "DC",
    rating: 5,
    comment:
      "As someone who commutes daily, the monthly booking feature saves me so much time and money. The app is incredibly easy to use.",
  },
  {
    id: "t3",
    name: "Maria Rodriguez",
    initials: "MR",
    rating: 4,
    comment:
      "Great selection of garages near the airport. The price comparison feature helped me find a spot at half the price I usually pay.",
  },
]
