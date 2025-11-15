import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single()

    if (roomError) throw roomError
    if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 })

    const { data: beds, error: bedsError } = await supabase
      .from('beds')
      .select('*')
      .eq('room_id', id)
      .order('label')

    if (bedsError) throw bedsError

    return NextResponse.json({ ...room, beds })
  } catch (error) {
    console.error('Error fetching room:', error)
    return NextResponse.json({ error: 'Failed to fetch room' }, { status: 500 })
  }
}
