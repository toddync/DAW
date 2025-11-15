export interface Room {
  id: string
  name: string
  description: string | null
  amenities: string[]
  bathroom: boolean
  images: string[]
  created_at: string
}

export interface Bed {
  id: string
  room_id: string
  label: string
  type: 'single' | 'couple' | 'bunk'
  position: 'near_door' | 'center' | 'window'
  amenities: string[]
  price_per_night: number
  created_at: string
}

export interface Booking {
  id: string
  bed_id: string
  start_date: string
  end_date: string
  guest_name: string
  created_at: string
}

export interface RoomWithBeds extends Room {
  beds: Bed[]
}

export interface BedAvailability extends Bed {
  available: boolean
}
