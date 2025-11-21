import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Função para criar uma resposta para o middleware
const createResponse = (request: NextRequest) => NextResponse.next({
  request: { headers: request.headers },
});

export async function middleware(request: NextRequest) {
  let response = createResponse(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Early return if no user and not on protected routes
  if (!user) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login?message=Authentication required', request.url));
    }
    return response;
  }

  // Single query to fetch user profile (role and nome) - OPTIMIZATION: Reduced from 2-3 queries to 1
  const { data: profile } = await supabase
    .from('usuarios')
    .select('role, nome')
    .eq('id', user.id)
    .single();

  // Proteger rotas de admin
  if (pathname.startsWith('/admin')) {
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Lógica de Onboarding para novos usuários
  if (!pathname.startsWith('/account/onboarding') && !pathname.startsWith('/login')) {
    // Se o perfil não tiver nome, redireciona para o onboarding
    if (profile && (profile.nome === null || profile.nome === '')) {
      return NextResponse.redirect(new URL('/account/onboarding', request.url));
    }
  }

  return response;
}

export const config = {
  // Executa o middleware em todas as rotas, exceto as de API, arquivos estáticos, e imagens.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
