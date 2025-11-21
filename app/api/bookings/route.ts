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
      console.error('Booking API: User not authenticated');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Booking API: Received payload:', JSON.stringify(body, null, 2));
    
    const { vagas, valorTotal } = body;

    // Validação básica dos inputs
    if (!Array.isArray(vagas) || vagas.length === 0 || !valorTotal) {
      console.error('Booking API: Invalid payload structure', { vagasLength: vagas?.length, valorTotal });
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes: vagas e valorTotal' },
        { status: 400 }
      );
    }

    // Chama o serviço para criar a reserva de forma atômica
    console.log('Booking API: Calling createReserva service...');
    const reservaId = await createReserva(user.id, vagas, valorTotal);
    console.log('Booking API: Reservation created successfully:', reservaId);

    return NextResponse.json({ reserva_id: reservaId, message: 'Reserva criada com sucesso!' }, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Booking API Critical Error:', {
      message: errorMessage,
      stack: errorStack,
      errorObj: error
    });
    
    return NextResponse.json(
      { 
        error: 'Falha ao criar a reserva.',
        details: errorMessage,
        debug_id: crypto.randomUUID() // Help user identify this specific error instance
      }, 
      { status: 500 }
    );
  }
}
