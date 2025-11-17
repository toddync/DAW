'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { getSupabaseClient } from '@/lib/supabase-client'
import { User as SupabaseUser } from '@supabase/supabase-js'
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
      async (event, session) => {
        setUser(session?.user || null)
      }
    )

    supabase.auth.getUser().then(({ data: { user } }) => {
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
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">H</span>
          </div>
          <span className="font-bold text-lg text-foreground">Hostel Santa Teresa</span>
        </Link>

        <nav className="flex items-center gap-4 md:gap-6">
          <Link
            href="/booking"
            className={`text-sm font-medium transition-colors ${isBooking ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Quartos
          </Link>
          
          <CartSidebar />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <UserIcon className="h-5 w-5" />
                  <span className="sr-only">Abrir menu do usuário</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/reservations">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Minhas Reservas</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
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
