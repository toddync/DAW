// lib/services/usuariosService.ts

import { createClient } from "@/lib/supabase-server";
import { Usuario } from "@/lib/types";

/**
 * Busca um perfil de usuário pelo seu ID.
 * @param usuarioId - O ID do usuário (deve corresponder ao auth.users.id).
 * @returns O objeto do usuário ou null se não for encontrado.
 */
export async function getUsuarioById(usuarioId: string): Promise<Usuario | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', usuarioId)
        .single();

    if (error) {
        // Não é um erro se o usuário ainda não tiver um perfil criado
        if (error.code === 'PGRST116') {
            return null;
        }
        console.error("Erro ao buscar usuário:", error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * Cria um novo perfil de usuário. Geralmente chamado após o cadastro no Supabase Auth.
 * @param usuarioId - O ID do novo usuário (deve ser o mesmo que o auth.users.id).
 * @param email - O email do novo usuário.
 * @returns O objeto do usuário recém-criado.
 */
export async function createUsuario(usuarioId: string, email: string): Promise<Usuario> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('usuarios')
        .insert({
            id: usuarioId,
            email: email,
            // Você pode adicionar outros valores padrão aqui se necessário
        })
        .select()
        .single();

    if (error) {
        console.error("Erro ao criar usuário:", error);
        throw new Error("Não foi possível criar o perfil do usuário.");
    }

    return data;
}

// Define um tipo para os dados atualizáveis do perfil para segurança e clareza
type UpdateUsuarioData = Partial<Pick<Usuario, 'nome' | 'cpf' | 'identidade' | 'passaporte' | 'nacionalidade' | 'endereco' | 'telefone'>>;

/**
 * Atualiza os dados do perfil de um usuário.
 * @param usuarioId - O ID do usuário a ser atualizado.
 * @param dados - Um objeto com os campos do perfil a serem atualizados.
 * @returns O objeto do usuário atualizado.
 */
export async function updateUsuario(usuarioId: string, dados: UpdateUsuarioData): Promise<Usuario> {
    const supabase = await createClient();

    // Garante que apenas campos permitidos sejam atualizados
    const dadosParaAtualizar: UpdateUsuarioData = {
        nome: dados.nome,
        cpf: dados.cpf,
        identidade: dados.identidade,
        passaporte: dados.passaporte,
        nacionalidade: dados.nacionalidade,
        endereco: dados.endereco,
        telefone: dados.telefone,
    };

    const { data, error } = await supabase
        .from('usuarios')
        .update(dadosParaAtualizar)
        .eq('id', usuarioId)
        .select()
        .single();

    if (error) {
        console.error("Erro ao atualizar usuário:", error);
        throw new Error(error.message);
    }

    return data;
}
