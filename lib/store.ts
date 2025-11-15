import { create } from 'zustand'
import { Bed } from './types'

interface DateRange {
  start: string | null
  end: string | null
}

interface CartItem {
  bed: Bed
  dateRange: DateRange
  cart_item_id: string
}

interface FilterState {
  bedTypes: Set<string>
  amenities: Set<string>
}

interface BookingState {
  dateRange: DateRange
  setDateRange: (start: string | null, end: string | null) => void
  selectedBed: string | null
  setSelectedBed: (bedId: string | null) => void
  isBooking: boolean
  setIsBooking: (isBooking: boolean) => void
  filters: FilterState
  toggleBedType: (type: string) => void
  toggleAmenity: (amenity: string) => void
  clearFilters: () => void
  cart: CartItem[]
  fetchCart: () => Promise<void>
  addCartItem: (bed: Bed, dateRange: DateRange) => Promise<void>
  removeCartItem: (cart_item_id: string) => Promise<void>
  clearCart: () => Promise<void>
  clearCartFromStore: () => void
}

export const useBookingStore = create<BookingState>((set, get) => ({
  dateRange: { start: null, end: null },
  setDateRange: (start, end) =>
    set((state) => {
      if (state.dateRange.start === start && state.dateRange.end === end) {
        return {} // Don't update state if the date range is the same
      }
      return { dateRange: { start, end } }
    }),
  selectedBed: null,
  setSelectedBed: (bedId) => set({ selectedBed: bedId }),
  isBooking: false,
  setIsBooking: (isBooking) => set({ isBooking }),
  filters: {
    bedTypes: new Set(),
    amenities: new Set(),
  },
  toggleBedType: (type) =>
    set((state) => {
      const newBedTypes = new Set(state.filters.bedTypes)
      if (newBedTypes.has(type)) {
        newBedTypes.delete(type)
      } else {
        newBedTypes.add(type)
      }
      return {
        filters: { ...state.filters, bedTypes: newBedTypes },
      }
    }),
  toggleAmenity: (amenity) =>
    set((state) => {
      const newAmenities = new Set(state.filters.amenities)
      if (newAmenities.has(amenity)) {
        newAmenities.delete(amenity)
      } else {
        newAmenities.add(amenity)
      }
      return {
        filters: { ...state.filters, amenities: newAmenities },
      }
    }),
  clearFilters: () =>
    set({
      filters: {
        bedTypes: new Set(),
        amenities: new Set(),
      },
    }),
  cart: [],
  fetchCart: async () => {
    const response = await fetch('/api/cart')
    if (response.ok) {
      const cart = await response.json()
      set({ cart })
    }
  },
  addCartItem: async (bed, dateRange) => {
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bed_id: bed.id,
        start_date: dateRange.start,
        end_date: dateRange.end,
      }),
    })
    await get().fetchCart()
  },
  removeCartItem: async (cart_item_id) => {
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart_item_id }),
    })
    await get().fetchCart()
  },
  clearCart: async () => {
    const { cart } = get()
    for (const item of cart) {
      await get().removeCartItem(item.cart_item_id)
    }
  },
  clearCartFromStore: () => set({ cart: [] }),
}))
