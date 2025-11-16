// app/api/cart/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { getItensCarrinho, addItemCarrinho, removerItemCarrinho } from '@/lib/services/carrinhoService';

/**
 * API endpoint para buscar os itens do carrinho do usuário.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const itens = await getItensCarrinho(user.id);
    return NextResponse.json(itens);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`API Error in GET /api/cart: ${errorMessage}`);
    return NextResponse.json({ error: 'Falha ao buscar itens do carrinho.', details: errorMessage }, { status: 500 });
  }
}

/**
 * API endpoint para adicionar um item ao carrinho.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { vaga_id, data_inicio, data_fim } = body;

    if (!vaga_id || !data_inicio || !data_fim) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    const novoItem = await addItemCarrinho(user.id, { vaga_id, data_inicio, data_fim });
    return NextResponse.json(novoItem, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`API Error in POST /api/cart: ${errorMessage}`);
    return NextResponse.json({ error: 'Falha ao adicionar item ao carrinho.', details: errorMessage }, { status: 500 });
  }
}

/**
 * API endpoint para remover um item do carrinho.
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json({ error: 'ID do item é obrigatório' }, { status: 400 });
    }

    await removerItemCarrinho(user.id, itemId);
    return NextResponse.json({ message: 'Item removido do carrinho com sucesso' });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`API Error in DELETE /api/cart: ${errorMessage}`);
    return NextResponse.json({ error: 'Falha ao remover item do carrinho.', details: errorMessage }, { status: 500 });
  }
}
