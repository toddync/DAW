import { NextResponse } from 'next/server';
import { getTodosPagamentos } from '@/lib/services/admin/paymentsAdminService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const { data, total } = await getTodosPagamentos(page, limit);
        
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            data,
            page,
            limit,
            total,
            totalPages
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
    }
}
