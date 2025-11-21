import { NextRequest, NextResponse } from 'next/server';
import { upsertPacoteQuarto, deletePacoteQuarto } from '@/lib/services/admin/pacotesAdminService';
import { handleAPIError } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

/**
 * API endpoint para atualizar uma entrada de pacote_quartos existente (Admin).
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Note: Authentication handled by middleware for /api/admin/* routes

    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: 'ID do pacote de quarto é obrigatório' }, { status: 400 });
    }

    try {
        const body = await request.json();
        const pacoteQuartoAtualizado = await upsertPacoteQuarto({ id, ...body });
        return NextResponse.json(pacoteQuartoAtualizado);
    } catch (error) {
        logger.error('Failed to update package', { packageId: id, error });
        return handleAPIError(error);
    }
}

/**
 * API endpoint para deletar uma entrada de pacote_quartos (Admin).
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Note: Authentication handled by middleware for /api/admin/* routes

    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: 'ID do pacote de quarto é obrigatório' }, { status: 400 });
    }

    try {
        await deletePacoteQuarto(id);
        return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
        logger.error('Failed to delete package', { packageId: id, error });
        return handleAPIError(error);
    }
}