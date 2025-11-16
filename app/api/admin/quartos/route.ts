// app/api/admin/quartos/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { getTodosQuartos, upsertQuarto } from '@/lib/services/admin/quartosAdminService';
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
 * API endpoint para buscar todos os quartos (Admin).
 */
export async function GET(request: NextRequest) {
    const { error } = await isAdmin(request);
    if (error) return error;

    try {
        const quartos = await getTodosQuartos();
        return NextResponse.json(quartos);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        return NextResponse.json({ error: 'Falha ao buscar quartos.', details: errorMessage }, { status: 500 });
    }
}

/**
 * API endpoint para criar um novo quarto (Admin).
 */
export async function POST(request: NextRequest) {
    const { error } = await isAdmin(request);
    if (error) return error;

    try {
        const body = await request.json();
        // Adicionar validação com Zod seria o ideal aqui
        const novoQuarto = await upsertQuarto(body);
        return NextResponse.json(novoQuarto, { status: 201 });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        return NextResponse.json({ error: 'Falha ao criar quarto.', details: errorMessage }, { status: 400 });
    }
}
