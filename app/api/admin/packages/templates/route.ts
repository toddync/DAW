// app/api/admin/packages/templates/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { getTodosPacotesTemplates } from '@/lib/services/admin/pacotesAdminService';
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
