// lib/services/carrinhoService.ts

import { createClient } from "@/lib/supabase-server";
import { CarrinhoItem, Vaga, Quarto } from "@/lib/types";

/**
 * Busca os itens do carrinho de um usuário.
 * @param usuarioId - O ID do usuário.
 * @returns Uma promessa que resolve para um array de itens do carrinho com detalhes da vaga e do quarto.
 */
export async function getItensCarrinho(usuarioId: string): Promise<CarrinhoItem[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('carrinho_itens')
        .select(`
            id,
            usuario_id,
            vaga_id,
            data_inicio,
            data_fim,
            created_at,
            pacote_quarto_id,
            preco_fixo,
            vaga:vagas (
                *,
                quarto:quartos (
                    *
                )
            )
        `)
        .eq('usuario_id', usuarioId);

    if (error) {
        console.error("Erro ao buscar itens do carrinho:", error);
        throw new Error(error.message);
    }

    // Supabase returns single relation as object or array depending on query, forcing cast here
    return data as unknown as CarrinhoItem[];
}

interface ItemParaAdicionar {
    vaga_id: string;
    data_inicio: string;
    data_fim: string;
}

/**
 * Adiciona um item ao carrinho do usuário.
 * @param usuarioId - O ID do usuário.
 * @param item - O objeto do item a ser adicionado.
 * @returns O item do carrinho que foi criado.
 */
export async function addItemCarrinho(usuarioId: string, item: ItemParaAdicionar): Promise<CarrinhoItem> {
    const supabase = await createClient();

    // Opcional: Verificar se o item já existe para evitar duplicatas
    const { data: existente, error: erroBusca } = await supabase
        .from('carrinho_itens')
        .select('id')
        .eq('usuario_id', usuarioId)
        .eq('vaga_id', item.vaga_id)
        .eq('data_inicio', item.data_inicio)
        .eq('data_fim', item.data_fim)
        .single();

    if (existente) {
        throw new Error("Este item já está no seu carrinho.");
    }

    const { data, error } = await supabase
        .from('carrinho_itens')
        .insert({
            usuario_id: usuarioId,
            vaga_id: item.vaga_id,
            data_inicio: item.data_inicio,
            data_fim: item.data_fim,
        })
        .select()
        .single();

    if (error) {
        console.error("Erro detalhado ao adicionar item ao carrinho:", error);
        throw new Error("Ocorreu um erro ao adicionar o item ao carrinho. Verifique os dados e tente novamente.");
    }

    return data as CarrinhoItem;
}

/**
 * Remove um item do carrinho do usuário.
 * @param usuarioId - O ID do usuário.
 * @param itemId - O ID do item do carrinho a ser removido.
 */
export async function removerItemCarrinho(usuarioId: string, itemId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from('carrinho_itens')
        .delete()
        .eq('id', itemId)
        .eq('usuario_id', usuarioId); // Garante que o usuário só pode remover seus próprios itens

    if (error) {
        console.error("Erro ao remover item do carrinho:", error);
        throw new Error(error.message);
    }
}
