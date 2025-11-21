import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Create Supabase client for API routes and server components
 * This client has read-only cookie access, suitable for API routes
 * Cookie updates are handled by middleware
 */
export async function createSupabaseAdmin() {
    const cookieStore = await cookies();
    
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set() {
                    // API routes can't set cookies - handled by middleware
                },
                remove() {
                    // API routes can't remove cookies - handled by middleware
                },
            },
        }
    );
}
