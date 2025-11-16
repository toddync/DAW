// app/api/reservations/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { getReservasByUsuarioId } from '@/lib/services/reservasService';

/**
 * API endpoint para buscar as reservas do usuário autenticado.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reservas = await getReservasByUsuarioId(user.id);

    return NextResponse.json(reservas);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`API Error in GET /api/reservations: ${errorMessage}`);
    return NextResponse.json(
      { 
        error: 'Falha ao buscar as reservas.',
        details: errorMessage 
      }, 
      { status: 500 }
    );
  }
}
