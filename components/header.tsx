'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { getSupabaseClient } from '@/lib/supabase-client'
import { User as SupabaseUser, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User as UserIcon, LogOut, LayoutDashboard, ShoppingCart } from 'lucide-react'
import { Skeleton } from './ui/skeleton'

const CartSidebar = dynamic(() => import('./cart-sidebar').then(mod => mod.CartSidebar), {
  ssr: false,
  loading: () => (
    <Button variant="outline" size="icon" className="relative" disabled>
      <ShoppingCart className="h-5 w-5" />
      <span className="sr-only">Carregando carrinho</span>
    </Button>
  ),
})

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const isBooking = pathname === '/booking'

  const [user, setUser] = useState<SupabaseUser | null>(null)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user || null)
      }
    )

    supabase.auth.getUser().then(({ data: { user } }: { data: { user: SupabaseUser | null } }) => {
      setUser(user)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh() // Garante que o estado do servidor seja limpo
  }

  return (
    <header className={"border-b border-border/40 bg-background/70 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 " + (pathname.includes('/admin') ? 'hidden' : '')}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
            <span className="text-primary-foreground font-bold text-xl">H</span>
          </div>
          <span className="font-bold text-xl text-foreground tracking-tight group-hover:text-primary transition-colors">Hostel Santa Teresa</span>
        </Link>

        <nav className="flex items-center gap-6 md:gap-8">
          <Link
            href="/booking"
            className={`text-sm font-medium transition-all hover:-translate-y-0.5 ${isBooking ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'}`}
          >
            Quartos
          </Link>
          <Link
            href="/packages"
            className={`text-sm font-medium transition-all hover:-translate-y-0.5 ${pathname === '/packages' ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'}`}
          >
            Pacotes
          </Link>

          <CartSidebar />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                  <UserIcon className="h-5 w-5" />
                  <span className="sr-only">Abrir menu do usuário</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Minha Conta</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/reservations">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Minhas Reservas</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/account/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-medium hover:text-primary hover:bg-primary/5">
                  Entrar
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="font-medium shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                  Cadastrar
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
