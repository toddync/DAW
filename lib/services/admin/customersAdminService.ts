import { createClient } from "@/lib/supabase-server";
import { Usuario } from "@/lib/types";

export async function getTodosUsuarios(): Promise<Usuario[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('nome', { ascending: true });

    if (error) {
        console.error("Erro ao buscar usuários:", error);
        throw new Error("Falha ao buscar usuários.");
    }

    return data;
}

export async function getUsuarioById(id: string): Promise<Usuario | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Erro ao buscar usuário com ID ${id}:`, error);
        throw new Error("Falha ao buscar usuário.");
    }

    return data;
}

export async function updateUsuario(id: string, updates: Partial<Usuario>): Promise<Usuario> {
    const supabase = await createClient();
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
