// lib/services/avaliacoesService.ts

import { createClient } from "@/lib/supabase-server";

interface AvaliacaoData {
    reserva_id: string;
    usuario_id: string;
    nota: number;
    comentario?: string;
    publica?: boolean;
}

/**
 * Adiciona uma nova avaliação para uma reserva.
 * @param dados - Os dados da avaliação a serem inseridos.
 * @returns O registro da avaliação criada.
 */
export async function adicionarAvaliacao(dados: AvaliacaoData): Promise<any> {
    const supabase = await createClient();

    // Validação dos dados
    if (dados.nota < 1 || dados.nota > 5) {
        throw new Error("A nota deve ser entre 1 e 5.");
    }
    if (!dados.reserva_id || !dados.usuario_id) {
        throw new Error("ID da reserva e do usuário são obrigatórios.");
    }

    const { data, error } = await supabase
        .from('avaliacoes')
        .insert({
            reserva_id: dados.reserva_id,
            usuario_id: dados.usuario_id,
            nota: dados.nota,
            comentario: dados.comentario,
            publica: dados.publica ?? true, // Padrão para público se não especificado
        })
        .select()
        .single();

    if (error) {
        // Trata o caso de avaliação duplicada de forma amigável
        if (error.code === '23505') { // unique_violation
            throw new Error("Você já avaliou esta reserva.");
        }
        console.error("Erro ao adicionar avaliação:", error);
        throw new Error(error.message);
    }

    return data;
}
