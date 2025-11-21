import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { Pagamento } from "@/lib/types";

export async function getTodosPagamentos(
  page: number = 1,
  limit: number = 20
): Promise<{ data: Pagamento[], total: number }> {
  const supabase = await createSupabaseAdmin();
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('pagamentos')
    .select(`
      *,
      reservas (
        id,
        codigo_reserva,
        usuarios (
          nome,
          email
        )
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Erro ao buscar pagamentos:", error);
    throw new Error("Falha ao buscar pagamentos.");
  }

  return { data: data || [], total: count || 0 };
}

export async function getPagamentoById(id: string): Promise<Pagamento | null> {
  const supabase = await createSupabaseAdmin();
  const { data, error } = await supabase
    .from('pagamentos')
    .select(`
      *,
      reservas (
        id,
        codigo_reserva,
        usuarios (
          nome,
          email
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error(`Erro ao buscar pagamento com ID ${id}:`, error);
    throw new Error("Falha ao buscar pagamento.");
  }

  return data;
}

export async function updatePagamentoStatus(id: string, status: string): Promise<Pagamento> {
  const supabase = await createSupabaseAdmin();
  const { data, error } = await supabase
    .from('pagamentos')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Erro ao atualizar status do pagamento com ID ${id}:`, error);
    throw new Error("Falha ao atualizar pagamento.");
  }

  return data;
}
