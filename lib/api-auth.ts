import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { APIError, CommonErrors } from './api-error-handler';
import { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Create Supabase client for API routes
 * Uses cookies from the request for authentication
 */
async function getSupabaseForAPI() {
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
          // API routes can't set cookies - that's done by middleware
        },
        remove() {
          // API routes can't remove cookies - that's done by middleware
        },
      },
    }
  );
}

/**
 * Require authentication for API route
 * Throws APIError if user is not authenticated
 */
export async function requireAuth(): Promise<User> {
  const supabase = await getSupabaseForAPI();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw CommonErrors.UNAUTHORIZED;
  }

  return user;
}

/**
 * Require admin role for API route
 * Throws APIError if user is not authenticated or not admin
 */
export async function requireAdmin(): Promise<{ user: User; profile: { role: string } }> {
  const user = await requireAuth();
  const supabase = await getSupabaseForAPI();

  const { data: profile, error } = await supabase
    .from('usuarios')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    throw new APIError(
      'Não foi possível verificar suas permissões.',
      500,
      'PROFILE_FETCH_ERROR'
    );
  }

  if (profile.role !== 'admin') {
    throw CommonErrors.FORBIDDEN;
  }

  return { user, profile };
}
