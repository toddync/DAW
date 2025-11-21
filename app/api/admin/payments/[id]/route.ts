import { NextResponse } from 'next/server';
import { getPagamentoById, updatePagamentoStatus } from '@/lib/services/admin/paymentsAdminService';
import { handleAPIError } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const pagamento = await getPagamentoById(id);
        if (!pagamento) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }
        return NextResponse.json(pagamento);
    } catch (error) {
        logger.error('Failed to fetch payment', { error });
        return handleAPIError(error);
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { status } = await request.json();
        const pagamento = await updatePagamentoStatus(id, status);
        return NextResponse.json(pagamento);
    } catch (error) {
        logger.error('Failed to update payment status', { error });
        return handleAPIError(error);
    }
}
