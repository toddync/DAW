'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, ChevronLeft, MapPin } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useBookingStore } from '@/lib/store'
import { RoomWithBeds, Bed } from '@/lib/types'

const bedTypeLabels = {
  single: 'Single Bed',
  couple: 'Couple/Double',
  bunk: 'Bunk Bed',
}

const positionLabels = {
  near_door: 'Near Door',
  center: 'Center',
  window: 'Window View',
}

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string
  const [room, setRoom] = useState<RoomWithBeds | null>(null)
  const [bedAvailability, setBedAvailability] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { dateRange, addCartItem } = useBookingStore()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchRoom() {
      try {
        setLoading(true)
        const response = await fetch(`/api/rooms/${roomId}`)
        if (!response.ok) throw new Error('Failed to fetch room')

        const data = await response.json()
        setRoom(data)
        setError(null)

        // Check availability for each bed if dates are selected
        if (dateRange.start && dateRange.end) {
          const availability: Record<string, boolean> = {}
          for (const bed of data.beds) {
            const availResponse = await fetch(
              `/api/availability?bedId=${bed.id}&start=${dateRange.start}&end=${dateRange.end}`
            )
            const avail = await availResponse.json()
            availability[bed.id] = avail.available
          }
          setBedAvailability(availability)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (roomId) {
      fetchRoom()
    }
  }, [roomId, dateRange])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-lg">Loading room...</div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive text-lg">Room not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-card z-10">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{room.name}</h1>
            <p className="text-muted-foreground mt-1">{room.description}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-destructive">{error}</div>
          </div>
        )}

        {/* Amenities Section */}
        <Card>
          <CardHeader>
            <CardTitle>Room Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {room.bathroom && (
                <Badge variant="secondary" className="text-sm">
                  Bathroom
                </Badge>
              )}
              {room.amenities.map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-sm">
                  {amenity.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Beds Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Available Beds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {room.beds.map((bed) => {
              const isAvailable = dateRange.start && dateRange.end ? bedAvailability[bed.id] : true
              const isUnavailable = dateRange.start && dateRange.end && !isAvailable

              return (
                <Card
                  key={bed.id}
                  className={`cursor-pointer transition-all ${
                    isUnavailable
                      ? 'opacity-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => {
                    if (!isUnavailable) {
                      // Potentially select for details view in future
                    }
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-4">
                      <span className="text-lg">{bed.label}</span>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary text-primary-foreground">
                          {bedTypeLabels[bed.type as keyof typeof bedTypeLabels]}
                        </Badge>
                        {isUnavailable && (
                          <Badge variant="destructive" className="text-xs">
                            Unavailable
                          </Badge>
                        )}
                        {isAvailable && dateRange.start && (
                          <Badge variant="outline" className="text-xs">
                            Available
                          </Badge>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {positionLabels[bed.position as keyof typeof positionLabels]}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {bed.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-border">
                      <p className="font-semibold text-foreground">
                        ${bed.price_per_night.toFixed(2)} per night
                      </p>
                    </div>

                    <Button
                      onClick={async (e) => {
                        e.stopPropagation()
                        if (dateRange.start && dateRange.end) {
                          await addCartItem(bed, dateRange)
                          toast({
                            title: 'Added to Cart',
                            description: `${bed.label} in ${room.name} has been added to your cart.`,
                          })
                        }
                      }}
                      disabled={isUnavailable || !dateRange.start || !dateRange.end}
                      className="w-full mt-2"
                    >
                      {isUnavailable
                        ? 'Not Available'
                        : !dateRange.start || !dateRange.end
                          ? 'Select Dates to Book'
                          : 'Add to Cart'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
