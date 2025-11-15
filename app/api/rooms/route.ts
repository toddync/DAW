import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    // Fetch rooms with their beds
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .order('name')

    if (roomsError) throw roomsError

    // Fetch all beds
    const { data: beds, error: bedsError } = await supabase
      .from('beds')
      .select('*')
      .order('room_id, label')

    if (bedsError) throw bedsError

    // If date range provided, check availability
    if (start && end) {
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('bed_id, start_date, end_date')

      if (bookingsError) throw bookingsError

      // Mark beds as available/unavailable
      const bedsWithAvailability = beds!.map((bed) => {
        const isAvailable = !bookings!.some((booking) => {
          // Check for overlap: NOT (end_date <= start OR start_date >= end)
          return !(new Date(booking.end_date) <= new Date(start) || 
                   new Date(booking.start_date) >= new Date(end))
        })
        return { ...bed, available: isAvailable }
      })

      const roomsWithBeds = rooms!.map((room) => ({
        ...room,
        beds: bedsWithAvailability.filter((bed) => bed.room_id === room.id),
      }))

      return NextResponse.json(roomsWithBeds)
    }

    // Return rooms with beds (no availability info)
    const roomsWithBeds = rooms!.map((room) => ({
      ...room,
      beds: beds!.filter((bed) => bed.room_id === room.id),
    }))

    return NextResponse.json(roomsWithBeds)
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 })
  }
}
