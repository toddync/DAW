// app/api/admin/packages/templates/[id]/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { upsertPacote, deletePacote } from '@/lib/services/admin/pacotesAdminService';
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
 * API endpoint para atualizar um template de pacote (Admin).
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await isAdmin(request);
    if (error) return error;

    try {
        const { id } = await params;
        const body = await request.json();

        // Validação básica
        if (!body.nome) {
            return NextResponse.json({ error: 'O nome do pacote é obrigatório.' }, { status: 400 });
        }

        const pacoteAtualizado = await upsertPacote({ ...body, id });
        return NextResponse.json(pacoteAtualizado);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error(`API Error in PUT /api/admin/packages/templates/[id]: ${errorMessage}`);
        return NextResponse.json({ error: 'Falha ao atualizar template de pacote.', details: errorMessage }, { status: 500 });
    }
}

/**
 * API endpoint para deletar um template de pacote (Admin).
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await isAdmin(request);
    if (error) return error;

    try {
        const { id } = await params;
        await deletePacote(id);
        return new NextResponse(null, { status: 204 });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error(`API Error in DELETE /api/admin/packages/templates/[id]: ${errorMessage}`);
        return NextResponse.json({ error: 'Falha ao deletar template de pacote.', details: errorMessage }, { status: 500 });
    }
}
