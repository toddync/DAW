import { NextResponse } from 'next/server';
import { getOcupacaoPorPeriodo } from '@/lib/services/admin/vacancyAdminService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const inicio = searchParams.get('inicio');
    const fim = searchParams.get('fim');

    if (!inicio || !fim) {
        return NextResponse.json({ error: 'Start and end dates are required' }, { status: 400 });
    }

    try {
        const ocupacao = await getOcupacaoPorPeriodo(new Date(inicio), new Date(fim));
        return NextResponse.json(ocupacao);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch vacancy data' }, { status: 500 });
    }
}
