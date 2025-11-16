// lib/services/admin/pacotesAdminService.ts
import { createClient } from '@/lib/supabase-server';
import { Pacote, PacoteQuarto } from '@/lib/types';

/**
 * Busca todos os pacotes (templates) do banco de dados.
 * @returns Uma lista de pacotes.
 */
export async function getTodosPacotesTemplates(): Promise<Pacote[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pacotes')
    .select('*')
    .order('nome', { ascending: true });

  if (error) {
    console.error('Erro ao buscar templates de pacotes:', error);
    throw new Error('Falha ao buscar templates de pacotes.');
  }
  return data;
}

/**
 * Busca todas as entradas de pacote_quartos do banco de dados, incluindo dados aninhados.
 * @returns Uma lista de PacoteQuarto.
 */
export async function getTodosPacoteQuartos(): Promise<PacoteQuarto[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pacote_quartos')
    .select(`
      *,
      pacotes (id, nome, descricao),
      quartos (id, numero, tipo_quarto, capacidade, preco_base)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar pacotes de quartos:', error);
    throw new Error('Falha ao buscar pacotes de quartos.');
  }
  return data;
}

/**
 * Busca uma entrada de pacote_quartos específica pelo ID.
 * @param id O ID da entrada pacote_quartos.
 * @returns A entrada PacoteQuarto encontrada ou null.
 */
export async function getPacoteQuartoById(id: string): Promise<PacoteQuarto | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pacote_quartos')
    .select(`
      *,
      pacotes (id, nome, descricao),
      quartos (id, numero, tipo_quarto, capacidade, preco_base)
    `)
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error(`Erro ao buscar pacote de quarto com ID ${id}:`, error);
    throw new Error('Falha ao buscar pacote de quarto.');
  }
  return data;
}

/**
 * Cria ou atualiza uma entrada de pacote_quartos.
 * Se a entrada tiver um ID, ela será atualizada; caso contrário, uma nova será criada.
 * @param pacoteQuarto Os dados da entrada pacote_quartos a serem criados ou atualizados.
 * @returns A entrada PacoteQuarto criada ou atualizada.
 */
export async function upsertPacoteQuarto(pacoteQuarto: Partial<PacoteQuarto>): Promise<PacoteQuarto> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pacote_quartos')
    .upsert(pacoteQuarto)
    .select(`
      *,
      pacotes (id, nome, descricao),
      quartos (id, numero, tipo_quarto, capacidade, preco_base)
    `)
    .single();

  if (error) {
    console.error('Erro ao salvar pacote de quarto:', error);
    throw new Error('Falha ao salvar pacote de quarto.');
  }
  return data;
}

/**
 * Deleta uma entrada de pacote_quartos pelo ID.
 * @param id O ID da entrada pacote_quartos a ser deletada.
 */
export async function deletePacoteQuarto(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('pacote_quartos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Erro ao deletar pacote de quarto com ID ${id}:`, error);
    throw new Error('Falha ao deletar pacote de quarto.');
  }
}
