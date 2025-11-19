import { NextResponse } from 'next/server';
import { getTodosPagamentos } from '@/lib/services/admin/paymentsAdminService';

export async function GET() {
    try {
        const pagamentos = await getTodosPagamentos();
        return NextResponse.json(pagamentos);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
    }
}
