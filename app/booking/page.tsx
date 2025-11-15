'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, Wifi, Droplets, Wind } from 'lucide-react'
import { useBookingStore } from '@/lib/store'
import { DateRangePicker } from '@/components/date-range-picker'
import { FilterSidebar } from '@/components/filter-sidebar'
import { RoomWithBeds } from '@/lib/types'

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  bathroom: <Droplets className="w-4 h-4" />,
  air_conditioning: <Wind className="w-4 h-4" />,
}

function getAmenityIcon(amenity: string) {
  return amenityIcons[amenity] || null
}

export default function BookingPage() {
  const [rooms, setRooms] = useState<RoomWithBeds[]>([])
  const [filteredRooms, setFilteredRooms] = useState<RoomWithBeds[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { dateRange, filters } = useBookingStore()
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (dateRange.start) params.append('start', dateRange.start)
        if (dateRange.end) params.append('end', dateRange.end)

        const response = await fetch(`/api/rooms?${params}`)
        if (!response.ok) throw new Error('Failed to fetch rooms')

        const data = await response.json()
        setRooms(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [dateRange])

  useEffect(() => {
    let filtered = rooms

    if (filters.bedTypes.size > 0) {
      filtered = filtered.map((room) => ({
        ...room,
        beds: room.beds.filter((bed) => filters.bedTypes.has(bed.type)),
      }))
    }

    if (filters.amenities.size > 0) {
      filtered = filtered.filter((room) =>
        Array.from(filters.amenities).some((amenity) =>
          room.amenities.includes(amenity)
        )
      )
    }

    filtered = filtered.filter((room) => room.beds.length > 0)

    setFilteredRooms(filtered)
  }, [rooms, filters])

  const getAvailableCount = (beds: any[]) => {
    return beds.filter((b) => b.available !== false).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-foreground text-lg">Loading rooms...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-16 bg-card z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Available Rooms</h1>
          <p className="text-muted-foreground mt-2">
            {dateRange.start && dateRange.end
              ? `Viewing availability from ${dateRange.start} to ${dateRange.end}`
              : 'Select dates to view availability'}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0 space-y-4 max-h-fit sticky top-32">
            <DateRangePicker />
            <FilterSidebar />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="text-destructive">{error}</div>
              </div>
            )}

            {filteredRooms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {rooms.length === 0 ? 'No rooms available' : 'No rooms match your filters'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRooms.map((room) => (
                  <Link href={`/rooms/${room.id}`} key={room.id}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                      {room.images && room.images.length > 0 && (
                        <div className="relative h-48 w-full bg-muted overflow-hidden">
                          <Image
                            src={room.images[0] || "/placeholder.svg"}
                            alt={room.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <CardHeader>
                        <CardTitle className="text-xl">{room.name}</CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{room.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {room.bathroom && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Droplets className="w-3 h-3" />
                              Bathroom
                            </Badge>
                          )}
                          {room.amenities.slice(0, 2).map((amenity) => (
                            <Badge key={amenity} variant="outline" className="text-xs">
                              {amenity.replace('_', ' ')}
                            </Badge>
                          ))}
                          {room.amenities.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{room.amenities.length - 2}
                            </Badge>
                          )}
                        </div>

                        <div className="pt-2 border-t border-border">
                          <p className="text-sm font-medium text-foreground">
                            {room.beds.length} beds available
                          </p>
                          {dateRange.start && dateRange.end && (
                            <p className="text-sm text-muted-foreground">
                              {getAvailableCount(room.beds)} available for dates
                            </p>
                          )}
                        </div>

                        <Button className="w-full mt-4" variant="default">
                          View Room
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
