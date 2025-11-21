import { NextResponse } from 'next/server';
import { getTodasVagas, upsertVaga } from '@/lib/services/admin/bedsAdminService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const { data, total } = await getTodasVagas(page, limit);
        
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            data,
            page,
            limit,
            total,
            totalPages
        });
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
