import { NextResponse } from 'next/server';
import { getPagamentoById, updatePagamentoStatus } from '@/lib/services/admin/paymentsAdminService';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const pagamento = await getPagamentoById(params.id);
        if (!pagamento) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }
        return NextResponse.json(pagamento);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch payment' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { status } = await request.json();
        const pagamento = await updatePagamentoStatus(params.id, status);
        return NextResponse.json(pagamento);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
    }
}
