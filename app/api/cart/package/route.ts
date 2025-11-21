import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-admin';
import { logger } from '@/lib/logger';
import { handleAPIError } from '@/lib/api-error-handler';

export const dynamic = 'force-dynamic';

/**
 * API endpoint to add a package to the cart
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseAdmin();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { pacote_quarto_id, data_inicio, data_fim } = body;

    if (!pacote_quarto_id || !data_inicio || !data_fim) {
      return NextResponse.json(
        { error: 'Missing required fields: pacote_quarto_id, data_inicio, data_fim' },
        { status: 400 }
      );
    }

    // Fetch package details
    const { data: pacoteQuarto, error: pacoteError } = await supabase
      .from('pacote_quartos')
      .select(`
        *,
        quartos!inner(
          id,
          numero,
          vagas(id, numero_vaga, tipo_cama)
        )
      `)
      .eq('id', pacote_quarto_id)
      .single();

    if (pacoteError || !pacoteQuarto) {
      logger.error('Package not found', { pacote_quarto_id, error: pacoteError });
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    // Validate dates
    if (data_inicio !== pacoteQuarto.data_inicio || data_fim !== pacoteQuarto.data_fim) {
      return NextResponse.json(
        { error: 'Package dates must match the fixed package dates' },
        { status: 400 }
      );
    }

    // Check if package is for closing entire room
    if (!pacoteQuarto.fechar_quarto) {
      return NextResponse.json(
        { error: 'This package does not support full room booking' },
        { status: 400 }
      );
    }

    // Get all beds in the room
    const beds = pacoteQuarto.quartos.vagas;
    if (!beds || beds.length === 0) {
      return NextResponse.json({ error: 'No beds found in room' }, { status: 400 });
    }

    // Check availability for all beds
    const bedIds = beds.map((b: any) => b.id);
    const { data: conflicts } = await supabase
      .from('carrinho_itens')
      .select('vaga_id')
      .in('vaga_id', bedIds)
      .or(`and(data_inicio.lte.${data_fim},data_fim.gte.${data_inicio})`);

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Some beds in this room are already in a cart for the selected dates' },
        { status: 409 }
      );
    }

    // Check for reservation conflicts
    const { data: reservationConflicts } = await supabase
      .from('reserva_vagas')
      .select('vaga_id')
      .in('vaga_id', bedIds)
      .lt('data_entrada', data_fim)
      .gt('data_saida', data_inicio);

    if (reservationConflicts && reservationConflicts.length > 0) {
      return NextResponse.json(
        { error: 'Some beds in this room are already reserved for the selected dates' },
        { status: 409 }
      );
    }

    // Add all beds to cart as a package
    const cartItems = beds.map((bed: any) => ({
      usuario_id: user.id,
      vaga_id: bed.id,
      data_inicio,
      data_fim,
      pacote_quarto_id,
      preco_fixo: pacoteQuarto.preco_total_pacote / beds.length, // Distribute price among beds
    }));

    const { error: insertError } = await supabase
      .from('carrinho_itens')
      .insert(cartItems);

    if (insertError) {
      logger.error('Failed to add package to cart', { error: insertError });
      return handleAPIError(insertError);
    }

    logger.info('Package added to cart', { pacote_quarto_id, user_id: user.id });

    return NextResponse.json({ success: true, message: 'Package added to cart' });
  } catch (error) {
    logger.error('Error adding package to cart', { error });
    return handleAPIError(error);
  }
}
