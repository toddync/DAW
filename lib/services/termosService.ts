// lib/services/termosService.ts

import { createClient } from "@/lib/supabase-server";

/**
 * Busca a versão mais recente e ativa dos Termos de Uso.
 * @returns O objeto de Termos de Uso ou null se não for encontrado.
 */
export async function getTermosAtivos(): Promise<{ texto: string; versao: string } | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('termos_uso')
        .select('texto, versao')
        .eq('ativo', true)
        .order('data_publicacao', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        // Não é necessariamente um erro se não houver termos, apenas retorna nulo.
        if (error.code === 'PGRST116') {
            return null;
        }
        console.error("Erro ao buscar Termos de Uso:", error);
        throw new Error(error.message);
    }

    return data;
}
