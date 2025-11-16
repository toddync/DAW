// app/api/bookings/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { createReserva } from '@/lib/services/reservasService';

/**
 * API endpoint para criar uma nova reserva.
 * Delega a lógica de negócio para a camada de serviço.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { vagas, valorTotal } = body;

    // Validação básica dos inputs
    if (!Array.isArray(vagas) || vagas.length === 0 || !valorTotal) {
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes: vagas e valorTotal' },
        { status: 400 }
      );
    }

    // Chama o serviço para criar a reserva de forma atômica
    const reservaId = await createReserva(user.id, vagas, valorTotal);

    return NextResponse.json({ reserva_id: reservaId, message: 'Reserva criada com sucesso!' }, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`API Error in POST /api/bookings: ${errorMessage}`);
    return NextResponse.json(
      { 
        error: 'Falha ao criar a reserva.',
        details: errorMessage 
      }, 
      { status: 500 }
    );
  }
}
