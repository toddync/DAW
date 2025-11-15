import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: cartItems, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      start_date,
      end_date,
      bed:beds (*)
    `)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const formattedCart = cartItems.map(item => ({
    bed: item.bed,
    dateRange: {
      start: item.start_date,
      end: item.end_date,
    },
    cart_item_id: item.id,
  }))

  return NextResponse.json(formattedCart)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { bed_id, start_date, end_date } = await request.json()

  if (!bed_id || !start_date || !end_date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      user_id: user.id,
      bed_id,
      start_date,
      end_date,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { cart_item_id } = await request.json()

    if (!cart_item_id) {
        return NextResponse.json({ error: 'Missing cart_item_id' }, { status: 400 })
    }

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cart_item_id)
        .eq('user_id', user.id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Item removed from cart' })
}
