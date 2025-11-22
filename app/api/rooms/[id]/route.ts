// app/api/rooms/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getQuartoById } from '@/lib/services/quartosService';

/**
 * API endpoint para buscar um quarto específico pelo ID, incluindo suas vagas e disponibilidade.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // WORKAROUND for Next.js bug where params are not correctly passed in some dynamic contexts.
  // Extract the ID directly from the URL path.
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1];

  if (!id || id === '[id]') {
    return NextResponse.json({ error: 'Room ID is missing or invalid.' }, { status: 400 });
  }

  const searchParams = request.nextUrl.searchParams;
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  try {
    const quarto = await getQuartoById(id, start, end);

    if (!quarto) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json(quarto);
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`API Error in /api/rooms/${id}:`, {
      message: error.message,
      code: error.code,
      details: error.details,
    });

    const status = typeof error.status === 'number' ? error.status : 500;

    return NextResponse.json(
      {
        error: 'Failed to fetch room data.',
        details: errorMessage
      },
      { status: status }
    );
  }
}
