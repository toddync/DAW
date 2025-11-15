import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const bedId = searchParams.get('bedId')
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    if (!bedId || !start || !end) {
      return NextResponse.json(
        { error: 'Missing required parameters: bedId, start, end' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check for date range conflicts using the specified SQL logic
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('bed_id', bedId)
      .not('end_date', 'lte', start)
      .not('start_date', 'gte', end)
      .limit(1)

    if (error) throw error

    const available = data.length === 0

    return NextResponse.json({ available })
  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 })
  }
}
