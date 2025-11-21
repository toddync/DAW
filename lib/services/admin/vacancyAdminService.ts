import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { ControleOcupacao } from "@/lib/types";

export async function getOcupacaoPorPeriodo(inicio: Date, fim: Date): Promise<ControleOcupacao[]> {
    const supabase = await createSupabaseAdmin();
    const { data, error } = await supabase
        .from('controle_ocupacao')
        .select(`
      *,
      quartos (
        id,
        numero,
        tipo_quarto,
        capacidade
      )
    `)
        .gte('data_referencia', inicio.toISOString())
        .lte('data_referencia', fim.toISOString())
        .order('data_referencia', { ascending: true });

    if (error) {
        console.error("Erro ao buscar ocupação:", error);
        throw new Error("Falha ao buscar dados de ocupação.");
    }

    return data;
}

export async function gerarRelatorioOcupacao(dataReferencia: Date) {
    // Placeholder for more complex logic if needed, e.g., aggregating by room type
    const supabase = await createSupabaseAdmin();
    const { data, error } = await supabase
        .rpc('calcular_ocupacao_diaria', { data_calc: dataReferencia }); // Assuming a stored procedure exists or we implement logic here

    if (error) {
        // Fallback to manual calculation if RPC doesn't exist yet
        return getOcupacaoPorPeriodo(dataReferencia, dataReferencia);
    }
    return data;
}
