import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { bedId, startDate, endDate } = body

    // Validate inputs
    if (!bedId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: bedId, startDate, endDate' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    // Validate date range
    if (start >= end) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      )
    }

    if (start < now) {
      return NextResponse.json(
        { error: 'Cannot book dates in the past' },
        { status: 400 }
      )
    }

    // Check availability
    const { data: conflicts, error: conflictError } = await supabase
      .from('bookings')
      .select('id')
      .eq('bed_id', bedId)
      .not('end_date', 'lte', startDate)
      .not('start_date', 'gte', endDate)
      .limit(1)

    if (conflictError) throw conflictError

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Bed is not available for the selected dates' },
        { status: 409 }
      )
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        bed_id: bedId,
        start_date: startDate,
        end_date: endDate,
        user_id: user.id,
      })
      .select()
      .single()

    if (bookingError) throw bookingError

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const bedId = searchParams.get('bedId')

    const supabase = await createClient()

    let query = supabase.from('bookings').select('*').order('start_date', { ascending: true })

    if (bedId) {
      query = query.eq('bed_id', bedId)
    }

    const { data: bookings, error } = await query

    if (error) throw error

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
