import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      id,
      start_date,
      end_date,
      bed:beds (
        *,
        room:rooms (*)
      )
    `)
    .eq('guest_id', user.id) // Assuming guest_id links to auth.users
    .order('start_date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(bookings)
}
