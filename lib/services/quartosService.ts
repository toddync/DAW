// lib/services/quartosService.ts

import { createClient } from "@/lib/supabase-server";
import { QuartoComVagas } from "@/lib/types";

/**
 * Busca quartos e suas vagas, calculando a disponibilidade para um determinado período.
 * @param start - Data de início da consulta (formato YYYY-MM-DD).
 * @param end - Data de fim da consulta (formato YYYY-MM-DD).
 * @returns Uma promessa que resolve para um array de quartos com suas vagas e disponibilidade.
 */
export async function getQuartosDisponiveis(
  start: string | null,
  end: string | null
): Promise<QuartoComVagas[]> {
  const supabase = await createClient();

  try {
    // 1. Fetch all active rooms with their characteristics
    const { data: quartos, error: quartosError } = await supabase
      .from('quartos')
      .select(`
        id,
        numero,
        tipo_quarto,
        capacidade,
        preco_base,
        descricao,
        images,
        caracteristicas: quarto_caracteristicas (
          caracteristica: caracteristicas_quarto (
            nome,
            codigo,
            categoria,
            icone
          )
        )
      `)
      .eq('ativo', true)
      .order('numero');

    if (quartosError) throw new Error(`Error fetching quartos: ${quartosError.message}`);
    if (!quartos) return [];

    // 2. Fetch all beds for these rooms
    const quartoIds = quartos.map(q => q.id);
    const { data: vagas, error: vagasError } = await supabase
      .from('vagas')
      .select('*')
      .in('quarto_id', quartoIds)
      .order('numero_vaga');

    if (vagasError) throw new Error(`Error fetching vagas: ${vagasError.message}`);
    if (!vagas) return quartos as QuartoComVagas[]; // Retorna quartos sem vagas se não houver

    let unavailableVagaIds = new Set<string>();

    // 3. If date range is provided, check availability
    if (start && end) {
      // An overlap occurs if (StartA < EndB) and (EndA > StartB).
      const { data: conflictingReservas, error: bookingsError } = await supabase
        .from('reserva_vagas')
        .select('vaga_id')
        .lt('data_entrada', end) // Reservation starts before the query period ends
        .gt('data_saida', start); // Reservation ends after the query period starts
        
      if (bookingsError) throw new Error(`Error fetching bookings: ${bookingsError.message}`);

      unavailableVagaIds = new Set(conflictingReservas.map(r => r.vaga_id));
    }

    // 4. Structure the response
    const quartosComVagas = quartos.map((quarto) => {
      const vagasDoQuarto = vagas
        .filter((vaga) => vaga.quarto_id === quarto.id)
        .map(vaga => ({
          ...vaga,
          available: !unavailableVagaIds.has(vaga.id)
        }));

      return {
        ...quarto,
        vagas: vagasDoQuarto,
      };
    });

    return quartosComVagas as QuartoComVagas[];

  } catch (error) {
    console.error("getQuartosDisponiveis Service Error:", error);
    // Em um ambiente de produção, você poderia logar o erro em um serviço de monitoramento
    throw error; // Re-lança o erro para ser tratado pela camada superior (API route)
  }
}

/**
 * Busca um único quarto pelo seu ID, incluindo suas vagas e disponibilidade.
 * @param id - O UUID do quarto a ser buscado.
 * @param start - Data de início para checagem de disponibilidade (opcional).
 * @param end - Data de fim para checagem de disponibilidade (opcional).
 * @returns Uma promessa que resolve para o objeto do quarto ou null se não for encontrado.
 */
export async function getQuartoById(
  id: string,
  start: string | null,
  end: string | null
): Promise<QuartoComVagas | null> {
  const supabase = await createClient();
  try {
    // 1. Fetch the room with its characteristics
    const { data: quarto, error: quartoError } = await supabase
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
      .eq('ativo', true)
      .single();

    if (quartoError) throw new Error(`Error fetching quarto: ${quartoError.message}`);
    if (!quarto) return null;

    // 2. Fetch its beds
    const { data: vagas, error: vagasError } = await supabase
      .from('vagas')
      .select('*')
      .eq('quarto_id', id)
      .order('numero_vaga');

    if (vagasError) throw new Error(`Error fetching vagas: ${vagasError.message}`);

    let unavailableVagaIds = new Set<string>();

    // 3. Check availability if dates are provided
    if (start && end && vagas) {
      const { data: conflictingReservas, error: bookingsError } = await supabase
        .from('reserva_vagas')
        .select('vaga_id')
        .in('vaga_id', vagas.map(v => v.id)) // Only check for beds in this room
        .lt('data_entrada', end)
        .gt('data_saida', start);
        
      if (bookingsError) throw new Error(`Error fetching bookings: ${bookingsError.message}`);
      unavailableVagaIds = new Set(conflictingReservas.map(r => r.vaga_id));
    }

    // 4. Combine and return
    const vagasComDisponibilidade = (vagas || []).map(vaga => ({
      ...vaga,
      available: !unavailableVagaIds.has(vaga.id)
    }));

    return {
      ...quarto,
      vagas: vagasComDisponibilidade,
    } as QuartoComVagas;

  } catch (error) {
    console.error(`getQuartoById Service Error: ${error}`);
    throw error;
  }
}
