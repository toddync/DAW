import { NextResponse } from 'next/server';
import { getTodosUsuarios } from '@/lib/services/admin/customersAdminService';
import { handleAPIError } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // Extract pagination parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';

        logger.info('Fetching customers', { page, limit, search });

        // Fetch paginated data directly from the database
        const { data: paginatedUsuarios, total } = await getTodosUsuarios(page, limit, search);
        
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            data: paginatedUsuarios,
            page,
            limit,
            total,
            totalPages,
        });
    } catch (error) {
        logger.error('Failed to fetch customers', { error });
        return handleAPIError(error);
    }
}
