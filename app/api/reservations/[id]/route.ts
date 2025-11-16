// app/api/reservations/[id]/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { getReservaById, cancelarReserva } from '@/lib/services/reservasService';

/**
 * API endpoint para buscar uma reserva específica pelo ID.
 * Garante que apenas o proprietário da reserva possa acessá-la.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // WORKAROUND for Next.js bug where params are not correctly passed in some dynamic contexts.
  // Extract the ID directly from the URL path.
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1];

  if (!id || id === '[id]') {
    return NextResponse.json({ error: 'ID da reserva é obrigatório' }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reserva = await getReservaById(id, user.id);

    if (!reserva) {
      return NextResponse.json({ error: 'Reserva não encontrada ou não pertence a você.' }, { status: 404 });
    }

    return NextResponse.json(reserva);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`API Error in GET /api/reservations/${id}: ${errorMessage}`);
    return NextResponse.json(
      { 
        error: 'Falha ao buscar a reserva.',
        details: errorMessage 
      }, 
      { status: 500 }
    );
  }
}

/**
 * API endpoint para cancelar uma reserva.
 */
export async function DELETE(
    request: NextRequest
) {
    // WORKAROUND for Next.js bug where params are not correctly passed in some dynamic contexts.
    // Extract the ID directly from the URL path.
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    if (!id || id === '[id]') {
        return NextResponse.json({ error: 'ID da reserva é obrigatório' }, { status: 400 });
    }

    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await cancelarReserva(id, user.id);

        return NextResponse.json({ message: 'Reserva cancelada com sucesso.' }, { status: 200 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error(`API Error in DELETE /api/reservations/${id}: ${errorMessage}`);
        return NextResponse.json(
            { 
                error: 'Falha ao cancelar a reserva.',
                details: errorMessage 
            }, 
            { status: 400 } // Usar 400 para erros de regra de negócio (ex: fora do prazo)
        );
    }
}
