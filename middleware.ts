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

  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  const { pathname } = request.nextUrl;

  // Proteger rotas de admin
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?message=Authentication required', request.url));
    }
    const { data: profile } = await supabase
      .from('usuarios')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Lógica de Onboarding para novos usuários
  if (user && !pathname.startsWith('/account/onboarding') && !pathname.startsWith('/login')) {
    const { data: profile } = await supabase
      .from('usuarios')
      .select('nome')
      .eq('id', user.id)
      .single();

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
