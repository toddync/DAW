import { NextResponse } from 'next/server';
import { getVagaById, upsertVaga, deleteVaga } from '@/lib/services/admin/bedsAdminService';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const vaga = await getVagaById(params.id);
        if (!vaga) {
            return NextResponse.json({ error: 'Bed not found' }, { status: 404 });
        }
        return NextResponse.json(vaga);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch bed' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const vaga = await upsertVaga({ ...body, id: params.id });
        return NextResponse.json(vaga);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update bed' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await deleteVaga(params.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete bed' }, { status: 500 });
    }
}
