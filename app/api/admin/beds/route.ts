import { NextResponse } from 'next/server';
import { getTodasVagas, upsertVaga } from '@/lib/services/admin/bedsAdminService';

export async function GET() {
    try {
        const vagas = await getTodasVagas();
        return NextResponse.json(vagas);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch beds' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const vaga = await upsertVaga(body);
        return NextResponse.json(vaga);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create bed' }, { status: 500 });
    }
}
