import { NextResponse } from 'next/server';
import { getTodosUsuarios } from '@/lib/services/admin/customersAdminService';

export async function GET() {
    try {
        const usuarios = await getTodosUsuarios();
        return NextResponse.json(usuarios);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
}
