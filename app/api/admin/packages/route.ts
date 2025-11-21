import { NextRequest, NextResponse } from 'next/server';
import { getTodosPacoteQuartos, upsertPacoteQuarto } from '@/lib/services/admin/pacotesAdminService';
import { handleAPIError } from '@/lib/api-error-handler';

export const dynamic = 'force-dynamic';

/**
 * API endpoint para buscar todas as entradas de pacote_quartos (Admin).
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const { data, total } = await getTodosPacoteQuartos(page, limit);
        
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            data,
            page,
            limit,
            total,
            totalPages
        });
    } catch (err) {
        return handleAPIError(err);
    }
}

/**
 * API endpoint para criar uma nova entrada de pacote_quartos (Admin).
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Adicionar validação com Zod seria o ideal aqui
        const novoPacoteQuarto = await upsertPacoteQuarto(body);
        return NextResponse.json(novoPacoteQuarto, { status: 201 });
    } catch (err) {
        return handleAPIError(err);
    }
}