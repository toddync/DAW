import { NextResponse } from 'next/server';
import { getUsuarioById, updateUsuario } from '@/lib/services/admin/customersAdminService';
import { handleAPIError } from '@/lib/api-error-handler';
import { customerUpdateSchema } from '@/lib/schemas/customer';
import { logger } from '@/lib/logger';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Note: Authentication handled by middleware for /api/admin/* routes
        
        const { id } = await params;
        const usuario = await getUsuarioById(id);
        if (!usuario) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }
        
        return NextResponse.json(usuario);
    } catch (error) {
        logger.error('Failed to fetch customer', { error });
        return handleAPIError(error);
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Note: Authentication handled by middleware for /api/admin/* routes
        
        const { id } = await params;
        
        // Parse and validate request body
        const body = await request.json();
        const validatedData = customerUpdateSchema.parse(body);
        
        // Update customer
        const usuario = await updateUsuario(id, validatedData);
        
        logger.info('Customer updated successfully', { customerId: id });
        
        return NextResponse.json(usuario);
    } catch (error) {
        logger.error('Failed to update customer', { error });
        return handleAPIError(error);
    }
}
