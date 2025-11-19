import { NextResponse } from 'next/server';
import { getUsuarioById, updateUsuario } from '@/lib/services/admin/customersAdminService';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const usuario = await getUsuarioById(params.id);
        if (!usuario) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }
        return NextResponse.json(usuario);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const usuario = await updateUsuario(params.id, body);
        return NextResponse.json(usuario);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
    }
}
