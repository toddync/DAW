// app/api/admin/packages/templates/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { getTodosPacotesTemplates, upsertPacote } from '@/lib/services/admin/pacotesAdminService';
import { getUsuarioById } from '@/lib/services/usuariosService';

/**
 * Middleware de segurança para verificar se o usuário é um administrador.
 */
async function isAdmin(request: NextRequest): Promise<{ user: any; error?: NextResponse }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { user: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    const perfil = await getUsuarioById(user.id);
    if (perfil?.role !== 'admin') {
        return { user: null, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }

    return { user };
}

/**
 * API endpoint para buscar todos os templates de pacotes (Admin).
 */
export async function GET(request: NextRequest) {
    const { error } = await isAdmin(request);
    if (error) return error;

    try {
        const pacotesTemplates = await getTodosPacotesTemplates();
        return NextResponse.json(pacotesTemplates);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error(`API Error in GET /api/admin/packages/templates: ${errorMessage}`);
        return NextResponse.json({ error: 'Falha ao buscar templates de pacotes.', details: errorMessage }, { status: 500 });
    }
}

/**
 * API endpoint para criar um novo template de pacote (Admin).
 */
export async function POST(request: NextRequest) {
    const { error } = await isAdmin(request);
    if (error) return error;

    try {
        const body = await request.json();
        // Validação básica
        if (!body.nome) {
            return NextResponse.json({ error: 'O nome do pacote é obrigatório.' }, { status: 400 });
        }

        const novoPacote = await upsertPacote(body);
        return NextResponse.json(novoPacote, { status: 201 });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error(`API Error in POST /api/admin/packages/templates: ${errorMessage}`);
        return NextResponse.json({ error: 'Falha ao criar template de pacote.', details: errorMessage }, { status: 500 });
    }
}
