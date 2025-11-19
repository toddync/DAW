import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { getPacoteQuartoById } from '@/lib/services/admin/pacotesAdminService';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // Try to get ID from params first, then fallback to URL parsing if needed
    let id = params.id;

    // WORKAROUND: If params.id is missing or invalid (e.g. literal '[id]'), try parsing from URL
    if (!id || id === '[id]') {
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/');
        id = pathSegments[pathSegments.length - 1];
    }

    if (!id || id === '[id]') {
        return NextResponse.json({ error: 'Package ID is missing or invalid.' }, { status: 400 });
    }

    try {
        const pacote = await getPacoteQuartoById(id);

        if (!pacote) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }

        return NextResponse.json(pacote);
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error(`API Error in /api/packages/${id}:`, error);

        return NextResponse.json(
            {
                error: 'Failed to fetch package data.',
                details: errorMessage
            },
            { status: 500 }
        );
    }
}
