// app/api/admin/quartos/[id]/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { upsertQuarto, deleteQuarto } from '@/lib/services/admin/quartosAdminService';
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
 * API endpoint para atualizar um quarto existente (Admin).
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { error: adminError } = await isAdmin(request);
    if (adminError) return adminError;

    const { id } = params;
    if (!id) {
        return NextResponse.json({ error: 'ID do quarto é obrigatório' }, { status: 400 });
    }

    try {
        const body = await request.json();
        const quartoAtualizado = await upsertQuarto({ id, ...body });
        return NextResponse.json(quartoAtualizado);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        return NextResponse.json({ error: 'Falha ao atualizar quarto.', details: errorMessage }, { status: 400 });
    }
}

/**
 * API endpoint para deletar um quarto (Admin).
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { error: adminError } = await isAdmin(request);
    if (adminError) return adminError;

    const { id } = params;
    if (!id) {
        return NextResponse.json({ error: 'ID do quarto é obrigatório' }, { status: 400 });
    }

    try {
        await deleteQuarto(id);
        return new NextResponse(null, { status: 204 }); // No Content
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        return NextResponse.json({ error: 'Falha ao deletar quarto.', details: errorMessage }, { status: 500 });
    }
}
