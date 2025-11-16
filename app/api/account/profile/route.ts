// app/api/account/profile/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { getUsuarioById, updateUsuario } from '@/lib/services/usuariosService';

/**
 * API endpoint para buscar o perfil do usuário autenticado.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const perfil = await getUsuarioById(user.id);
    
    if (!perfil) {
        // Se o perfil não existe, retorna um objeto com o email para preenchimento inicial.
        // O trigger 'on_auth_user_created' deve ter criado a entrada básica.
        const { data: authUser } = await supabase.auth.getUser();
        return NextResponse.json({ email: authUser?.user?.email || '' }, { status: 200 });
    }

    return NextResponse.json(perfil);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`API Error in GET /api/account/profile: ${errorMessage}`);
    return NextResponse.json({ error: 'Falha ao buscar perfil.', details: errorMessage }, { status: 500 });
  }
}

/**
 * API endpoint para atualizar o perfil do usuário autenticado.
 */
export async function PUT(request: NextRequest) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
  
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const body = await request.json();
      
      // Validação e preparação dos dados para atualização
      const { nome, telefone, nacionalidade, documento_tipo, cpf, passaporte } = body;

      if (!nome || !nacionalidade || !documento_tipo) {
        return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
      }

      const dadosParaAtualizar: any = {
        nome,
        telefone,
        nacionalidade,
        cpf: null, // Garante que o campo será limpo se não for o tipo selecionado
        passaporte: null, // Garante que o campo será limpo
      };

      if (documento_tipo === 'cpf') {
        if (!cpf) return NextResponse.json({ error: 'CPF é obrigatório.' }, { status: 400 });
        dadosParaAtualizar.cpf = cpf;
      } else if (documento_tipo === 'passaporte') {
        if (!passaporte) return NextResponse.json({ error: 'Passaporte é obrigatório.' }, { status: 400 });
        dadosParaAtualizar.passaporte = passaporte;
      }

      const perfilAtualizado = await updateUsuario(user.id, dadosParaAtualizar);
  
      return NextResponse.json(perfilAtualizado);
  
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error(`API Error in PUT /api/account/profile: ${errorMessage}`);
      return NextResponse.json({ error: 'Falha ao atualizar perfil.', details: errorMessage }, { status: 500 });
    }
  }
