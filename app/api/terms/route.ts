// app/api/terms/route.ts
import { NextResponse } from 'next/server';
import { getTermosAtivos } from '@/lib/services/termosService';

/**
 * API endpoint para buscar os Termos de Uso ativos.
 */
export async function GET() {
  try {
    const termos = await getTermosAtivos();
    if (!termos) {
      return NextResponse.json({ error: 'Termos de Uso não encontrados.' }, { status: 404 });
    }
    return NextResponse.json(termos);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`API Error in GET /api/terms: ${errorMessage}`);
    return NextResponse.json(
      { 
        error: 'Falha ao buscar os Termos de Uso.',
        details: errorMessage 
      }, 
      { status: 500 }
    );
  }
}
