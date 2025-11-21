import { NextRequest, NextResponse } from 'next/server';
import { upsertQuarto, deleteQuarto } from '@/lib/services/admin/quartosAdminService';
import { handleAPIError } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

/**
 * API endpoint para atualizar um quarto existente (Admin).
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Note: Authentication handled by middleware for /api/admin/* routes

    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: 'ID do quarto é obrigatório' }, { status: 400 });
    }

    try {
        const body = await request.json();
        const quartoAtualizado = await upsertQuarto({ id, ...body });
        return NextResponse.json(quartoAtualizado);
    } catch (error) {
        logger.error('Failed to update room', { roomId: id, error });
        return handleAPIError(error);
    }
}

/**
 * API endpoint para deletar um quarto (Admin).
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Note: Authentication handled by middleware for /api/admin/* routes

    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: 'ID do quarto é obrigatório' }, { status: 400 });
    }

    try {
        await deleteQuarto(id);
        return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
        logger.error('Failed to delete room', { roomId: id, error });
        return handleAPIError(error);
    }
}
