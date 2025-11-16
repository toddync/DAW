// app/api/avaliacoes/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { adicionarAvaliacao } from '@/lib/services/avaliacoesService';

/**
 * API endpoint para criar uma nova avaliação.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { reserva_id, nota, comentario, publica } = body;

    // Validação do corpo da requisição
    if (!reserva_id || !nota) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes: reserva_id e nota' }, { status: 400 });
    }

    // Chama o serviço para adicionar a avaliação
    const novaAvaliacao = await adicionarAvaliacao({
        reserva_id,
        usuario_id: user.id, // Garante que o usuário só pode avaliar em seu nome
        nota,
        comentario,
        publica
    });

    return NextResponse.json(novaAvaliacao, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`API Error in POST /api/avaliacoes: ${errorMessage}`);
    return NextResponse.json(
      { 
        error: 'Falha ao registrar a avaliação.',
        details: errorMessage 
      }, 
      { status: 400 } // Usar 400 para erros de regra de negócio (ex: já avaliado)
    );
  }
}
