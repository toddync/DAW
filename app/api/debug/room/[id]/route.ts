import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: paramId } = await params;
  let id = paramId;

  // Fallback if params.id is not correctly populated
  if (!id || id === '[id]') {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    id = pathSegments[pathSegments.length - 1];
  }

  console.log(`Debug API: Checking room with ID: ${id}`);

  const supabase = await createClient();
  const { data: quarto, error } = await supabase
    .from('quartos')
    .select(`
      *,
      caracteristicas: quarto_caracteristicas (
        caracteristica: caracteristicas_quarto (
          nome,
          codigo,
          categoria,
          icone
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message, code: error.code, details: error.details }, { status: 500 });
  }

  return NextResponse.json(quarto);
}
