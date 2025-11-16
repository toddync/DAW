// app/api/admin/packages/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { getTodosPacoteQuartos, upsertPacoteQuarto } from '@/lib/services/admin/pacotesAdminService';
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
 * API endpoint para buscar todas as entradas de pacote_quartos (Admin).
 */
export async function GET(request: NextRequest) {
    const { error } = await isAdmin(request);
    if (error) return error;

    try {
        const pacoteQuartos = await getTodosPacoteQuartos();
        return NextResponse.json(pacoteQuartos);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error(`API Error in GET /api/admin/packages: ${errorMessage}`);
        return NextResponse.json({ error: 'Falha ao buscar pacotes de quartos.', details: errorMessage }, { status: 500 });
    }
}

/**
 * API endpoint para criar uma nova entrada de pacote_quartos (Admin).
 */
export async function POST(request: NextRequest) {
    const { error } = await isAdmin(request);
    if (error) return error;

    try {
        const body = await request.json();
        // Adicionar validação com Zod seria o ideal aqui
        const novoPacoteQuarto = await upsertPacoteQuarto(body);
        return NextResponse.json(novoPacoteQuarto, { status: 201 });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error(`API Error in POST /api/admin/packages: ${errorMessage}`);
        return NextResponse.json({ error: 'Falha ao criar pacote de quarto.', details: errorMessage }, { status: 400 });
    }
}