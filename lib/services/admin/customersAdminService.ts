import { createSupabaseAdmin } from '@/lib/supabase-admin';
import { Usuario } from "@/lib/types";

export async function getTodosUsuarios(
    page: number = 1,
    limit: number = 20,
    search: string = ''
): Promise<{ data: Usuario[], total: number }> {
    const supabase = await createSupabaseAdmin();
    
    let query = supabase
        .from('usuarios')
        .select('*', { count: 'exact' });

    if (search) {
        query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
        .order('nome', { ascending: true })
        .range(from, to);

    if (error) {
        console.error("Erro ao buscar usuários:", error);
        throw new Error("Falha ao buscar usuários.");
    }

    return { data: data || [], total: count || 0 };
}

export async function getUsuarioById(id: string): Promise<Usuario | null> {
    const supabase = await createSupabaseAdmin();
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        console.error(`Erro ao buscar usuário com ID ${id}:`, error);
        throw new Error("Falha ao buscar usuário.");
    }

    return data;
}

export async function updateUsuario(id: string, updates: Partial<Usuario>): Promise<Usuario> {
    const supabase = await createSupabaseAdmin();
    const { data, error } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
        throw new Error("Falha ao atualizar usuário.");
    }

    return data;
}
