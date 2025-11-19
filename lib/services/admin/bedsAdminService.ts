import { createClient } from "@/lib/supabase-server";
import { Vaga } from "@/lib/types";

export async function getTodasVagas(): Promise<Vaga[]> {
  const supabase = await createClient();
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
    .order('quarto_id', { ascending: true })
    .order('numero_vaga', { ascending: true });

  if (error) {
    console.error("Erro ao buscar todas as vagas:", error);
    throw new Error("Falha ao buscar vagas.");
  }

  return data;
}

export async function getVagaById(id: string): Promise<Vaga | null> {
  const supabase = await createClient();
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
    console.error(`Erro ao buscar vaga com ID ${id}:`, error);
    throw new Error("Falha ao buscar vaga.");
  }

  return data;
}

export async function upsertVaga(vaga: Partial<Vaga>): Promise<Vaga> {
  const supabase = await createClient();
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
  const supabase = await createClient();
  const { error } = await supabase
    .from('vagas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Erro ao deletar vaga com ID ${id}:`, error);
    throw new Error("Falha ao deletar vaga.");
  }
}
