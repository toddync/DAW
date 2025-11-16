// lib/services/reservasService.ts

import { createClient } from "@/lib/supabase-server";
import { Reserva } from "@/lib/types";

interface VagaParaReserva {
  vaga_id: string;
  data_inicio: string;
  data_fim: string;
  preco: number;
}

/**
 * Cria uma nova reserva de forma atômica usando uma função RPC do PostgreSQL.
 * @param usuarioId - O ID do usuário que está fazendo a reserva.
 * @param vagas - Um array de objetos contendo os detalhes das vagas a serem reservadas.
 * @param valorTotal - O valor total calculado para a reserva.
 * @returns O ID da reserva criada.
 */
export async function createReserva(
  usuarioId: string,
  vagas: VagaParaReserva[],
  valorTotal: number
): Promise<string> {
  const supabase = await createClient();
  
  // Busca a política de cancelamento padrão. Em um app real, isso poderia ser mais dinâmico.
  const { data: politica, error: politicaError } = await supabase
    .from('politicas_cancelamento')
    .select('id')
    .eq('nome', 'Política Flexível')
    .single();

  if (politicaError || !politica) {
    throw new Error('Política de cancelamento padrão não encontrada.');
  }

  const { data, error } = await supabase.rpc('criar_reserva_com_vagas', {
    p_usuario_id: usuarioId,
    p_politica_id: politica.id,
    p_vagas: vagas,
    p_valor_total: valorTotal,
    p_termos_aceitos: true // Assumindo que os termos foram aceitos no frontend
  });

  if (error) {
    console.error('Erro ao criar reserva via RPC:', error);
    throw new Error(`Falha ao criar reserva: ${error.message}`);
  }

  return data; // Retorna o UUID da reserva criada
}

/**
 * Busca todas as reservas de um usuário específico.
 * @param usuarioId - O ID do usuário.
 * @returns Uma promessa que resolve para um array de reservas com detalhes da vaga e do quarto.
 */
export async function getReservasByUsuarioId(usuarioId: string): Promise<any[]> {
    const supabase = await createClient();

    const { data: reservas, error } = await supabase
        .from('reservas')
        .select(`
            id,
            data_checkin,
            data_checkout,
            valor_total,
            status,
            avaliacoes ( id ),
            reserva_vagas (
                vaga:vagas (
                    id,
                    numero_vaga,
                    tipo_cama,
                    quarto:quartos (
                        id,
                        numero,
                        descricao,
                        images
                    )
                )
            )
        `)
        .eq('usuario_id', usuarioId)
        .order('data_checkin', { ascending: false });

    if (error) {
        console.error('Erro ao buscar reservas do usuário:', error);
        throw new Error(error.message);
    }

    return reservas;
}

/**
 * Busca uma reserva específica pelo seu ID, verificando a propriedade do usuário.
 * @param reservaId - O ID da reserva.
 * @param usuarioId - O ID do usuário para verificação de permissão.
 * @returns A reserva detalhada ou null se não encontrada ou não pertencer ao usuário.
 */
export async function getReservaById(reservaId: string, usuarioId: string): Promise<any | null> {
    const supabase = await createClient();

    const { data: reserva, error } = await supabase
        .from('reservas')
        .select(`
            id,
            codigo_reserva,
            data_checkin,
            data_checkout,
            valor_total,
            status,
            reserva_vagas (
                vaga:vagas (
                    numero_vaga,
                    tipo_cama,
                    quarto:quartos (
                        numero,
                        descricao
                    )
                )
            )
        `)
        .eq('id', reservaId)
        .eq('usuario_id', usuarioId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') { // Not found
            return null;
        }
        console.error('Erro ao buscar reserva por ID:', error);
        throw new Error(error.message);
    }

    return reserva;
}

/**
 * Cancela uma reserva de forma atômica, verificando as regras de negócio.
 * @param reservaId - O ID da reserva a ser cancelada.
 * @param usuarioId - O ID do usuário que está solicitando o cancelamento.
 */
export async function cancelarReserva(reservaId: string, usuarioId: string): Promise<void> {
    const supabase = await createClient();

    // Verifica se a reserva existe e pertence ao usuário
    const { data: reserva, error: fetchError } = await supabase
        .from('reservas')
        .select('id, status, politica_cancelamento_id, data_checkin')
        .eq('id', reservaId)
        .eq('usuario_id', usuarioId)
        .single();

    if (fetchError || !reserva) {
        throw new Error('Reserva não encontrada ou não pertence ao usuário.');
    }

    if (reserva.status !== 'pendente' && reserva.status !== 'confirmada') {
        throw new Error('A reserva não pode ser cancelada neste status.');
    }

    // A lógica de multa será tratada dentro da função PostgreSQL 'cancelar_reserva_atomic'
    const { error: rpcError } = await supabase.rpc('cancelar_reserva_atomic', {
        p_reserva_id: reservaId,
        p_usuario_id: usuarioId // Passa o ID do usuário, conforme a assinatura da função SQL
    });

    if (rpcError) {
        console.error('Erro ao chamar RPC cancelar_reserva_atomic:', rpcError);
        throw new Error(`Falha ao cancelar reserva: ${rpcError.message}`);
    }
}
