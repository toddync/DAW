import { NextRequest, NextResponse } from 'next/server';
import { getTodosQuartos, upsertQuarto } from '@/lib/services/admin/quartosAdminService';
import { handleAPIError } from '@/lib/api-error-handler';

export const dynamic = 'force-dynamic';

/**
 * API endpoint para buscar todos os quartos (Admin).
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const { data, total } = await getTodosQuartos(page, limit);
        
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
 * API endpoint para criar um novo quarto (Admin).
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Adicionar validação com Zod seria o ideal aqui
        const novoQuarto = await upsertQuarto(body);
        return NextResponse.json(novoQuarto, { status: 201 });
    } catch (err) {
        return handleAPIError(err);
    }
}
