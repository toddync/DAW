// app/api/admin/packages/[id]/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { upsertPacoteQuarto, deletePacoteQuarto } from '@/lib/services/admin/pacotesAdminService';
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
 * API endpoint para atualizar uma entrada de pacote_quartos existente (Admin).
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // params is a Promise
) {
    const { error: adminError } = await isAdmin(request);
    if (adminError) return adminError;

    const { id } = await params; // Await the params
    console.log({ id }); // Adicionado para depuração
    if (!id) {
        return NextResponse.json({ error: 'ID do pacote de quarto é obrigatório' }, { status: 400 });
    }

    try {
        const body = await request.json();
        const pacoteQuartoAtualizado = await upsertPacoteQuarto({ id, ...body });
        return NextResponse.json(pacoteQuartoAtualizado);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error(`API Error in PUT /api/admin/packages/${id}: ${errorMessage}`);
        return NextResponse.json({ error: 'Falha ao atualizar pacote de quarto.', details: errorMessage, originalError: err }, { status: 400 });
    }
}

/**
 * API endpoint para deletar uma entrada de pacote_quartos (Admin).
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // params is a Promise
) {
    const { error: adminError } = await isAdmin(request);
    if (adminError) return adminError;

    const { id } = await params; // Await the params
    console.log({ id }); // Adicionado para depuração
    if (!id) {
        return NextResponse.json({ error: 'ID do pacote de quarto é obrigatório' }, { status: 400 });
    }

    try {
        await deletePacoteQuarto(id);
        return new NextResponse(null, { status: 204 }); // No Content
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error(`API Error in DELETE /api/admin/packages/${id}: ${errorMessage}`);
        return NextResponse.json({ error: 'Falha ao deletar pacote de quarto.', details: errorMessage, originalError: err }, { status: 500 });
    }
}