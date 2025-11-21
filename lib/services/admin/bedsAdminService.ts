import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { Vaga } from "@/lib/types";

export async function getTodasVagas(
  page: number = 1,
  limit: number = 20
): Promise<{ data: Vaga[], total: number }> {
  const supabase = await createSupabaseAdmin();
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('vagas')
    .select(`
      *,
      quartos (
        id,
        numero,
        tipo_quarto
      )
    `, { count: 'exact' })
    .order('quarto_id', { ascending: true })
    .order('numero_vaga', { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Erro ao buscar todas as vagas:", error);
    throw new Error("Falha ao buscar vagas.");
  }

  return { data: data || [], total: count || 0 };
}

export async function getVagaById(id: string): Promise<Vaga | null> {
  const supabase = await createSupabaseAdmin();
  const { data, error } = await supabase
    .from('vagas')
    .select(`
      *,
      quartos (
        id,
        numero,
        tipo_quarto
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error(`Erro ao buscar vaga com ID ${id}:`, error);
    throw new Error("Falha ao buscar vaga.");
  }

  return data;
}

export async function upsertVaga(vaga: Partial<Vaga>): Promise<Vaga> {
  const supabase = await createSupabaseAdmin();
  const { data, error } = await supabase
    .from('vagas')
    .upsert(vaga)
    .select()
    .single();

  if (error) {
    console.error("Erro ao salvar vaga:", error);
    throw new Error("Falha ao salvar vaga.");
  }

  return data;
}

export async function deleteVaga(id: string): Promise<void> {
  const supabase = await createSupabaseAdmin();
  const { error } = await supabase
    .from('vagas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Erro ao deletar vaga com ID ${id}:`, error);
    throw new Error("Falha ao deletar vaga.");
  }
}
