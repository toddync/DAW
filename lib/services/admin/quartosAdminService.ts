// lib/services/admin/quartosAdminService.ts

import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { Quarto } from "@/lib/types";

/**
 * Busca todos os quartos para o painel de administração.
 * Não filtra por 'ativo' para permitir que o admin veja todos os quartos.
 * @returns Uma promessa que resolve para um array de todos os quartos.
 */
export async function getTodosQuartos(
    page: number = 1,
    limit: number = 20
): Promise<{ data: Quarto[], total: number }> {
    const supabase = await createSupabaseAdmin();
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
        .from('quartos')
        .select('*', { count: 'exact' })
        .order('numero')
        .range(from, to);

    if (error) {
        console.error("Erro ao buscar todos os quartos (Admin):", error);
        throw new Error(error.message);
    }

    return { data: data || [], total: count || 0 };
}

// Tipo para criação e atualização de quartos, omitindo campos gerenciados pelo DB
type UpsertQuartoData = Omit<Quarto, 'id' | 'created_at' | 'updated_at'>;

/**
 * Cria ou atualiza um quarto.
 * @param quartoData - Os dados do quarto a serem inseridos ou atualizados.
 * @returns O registro do quarto criado ou atualizado.
 */
export async function upsertQuarto(quartoData: Partial<UpsertQuartoData> & { id?: string }): Promise<Quarto> {
    const supabase = await createSupabaseAdmin();
    
    const { data, error } = await supabase
        .from('quartos')
        .upsert(quartoData)
        .select()
        .single();

    if (error) {
        console.error("Erro no upsert do quarto (Admin):", error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * Deleta um quarto pelo seu ID.
 * @param quartoId - O ID do quarto a ser deletado.
 */
export async function deleteQuarto(quartoId: string): Promise<void> {
    const supabase = await createSupabaseAdmin();
    
    const { error } = await supabase
        .from('quartos')
        .delete()
        .eq('id', quartoId);

    if (error) {
        console.error("Erro ao deletar quarto (Admin):", error);
        throw new Error(error.message);
    }
}
