// app/api/rooms/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getQuartosDisponiveis } from '@/lib/services/quartosService';

/**
 * API endpoint para buscar quartos e sua disponibilidade.
 * Extrai os parâmetros de data do request e chama a camada de serviço.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  try {
    const quartos = await getQuartosDisponiveis(start, end);
    return NextResponse.json(quartos);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`API Error in /api/rooms: ${errorMessage}`);
    return NextResponse.json(
      { 
        error: 'Failed to fetch room data.',
        details: errorMessage 
      }, 
      { status: 500 }
    );
  }
}
