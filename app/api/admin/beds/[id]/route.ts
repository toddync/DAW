import { NextResponse } from 'next/server';
import { getVagaById, upsertVaga, deleteVaga } from '@/lib/services/admin/bedsAdminService';
import { handleAPIError } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const vaga = await getVagaById(id);
        if (!vaga) {
            return NextResponse.json({ error: 'Bed not found' }, { status: 404 });
        }
        return NextResponse.json(vaga);
    } catch (error) {
        // We can't easily access id here if params await failed, but we can try
        logger.error('Failed to fetch bed', { error });
        return handleAPIError(error);
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const vaga = await upsertVaga({ ...body, id });
        return NextResponse.json(vaga);
    } catch (error) {
        logger.error('Failed to update bed', { error });
        return handleAPIError(error);
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await deleteVaga(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        logger.error('Failed to delete bed', { error });
        return handleAPIError(error);
    }
}
