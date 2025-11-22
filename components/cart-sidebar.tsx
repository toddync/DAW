'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase-client'
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useBookingStore } from '@/lib/store'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'

export function CartSidebar() {
  const { cart, fetchCart, removeCartItem, clearCart, clearCartFromStore } = useBookingStore()
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        const newUser = session?.user ?? null;
        setUser(newUser);

        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          // A store agora verifica o usuário, então podemos chamar fetchCart diretamente
          fetchCart();
        } else if (event === 'SIGNED_OUT') {
          // A store agora lida com a limpeza do carrinho, mas podemos garantir
          useBookingStore.getState().clearCartFromStore();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, fetchCart]);

  const calculateNights = (start: string, end: string) => {
    const startDate = parseISO(start)
    const endDate = parseISO(end)
    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    )
  }

  const totalItems = cart.length
  const cartTotal = cart.reduce((total, item) => {
    if (item.data_inicio && item.data_fim) {
      const nights = calculateNights(item.data_inicio, item.data_fim)
      const pricePerNight = item.vaga.quarto.preco_base / item.vaga.quarto.capacidade
      return total + nights * pricePerNight
    }
    return total
  }, 0)

  const handleCheckout = () => {
    if (!user) {
      router.push('/login?redirect=/checkout')
      return
    }
    router.push('/checkout')
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Seu Carrinho ({totalItems})</SheetTitle>
        </SheetHeader>
        {cart.length > 0 ? (
          <>
            <ScrollArea className="flex-grow -mr-6 pr-6">
              <div className="space-y-4">
                {cart.map((item) => {
                  const nights =
                    item.data_inicio && item.data_fim
                      ? calculateNights(
                        item.data_inicio,
                        item.data_fim
                      )
                      : 0
                  const pricePerNight = item.vaga.quarto.preco_base / item.vaga.quarto.capacidade
                  const itemTotal = nights * pricePerNight
                  return (
                    <Card key={item.id} className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-base capitalize">
                          Quarto {item.vaga.quarto.numero} - Cama {item.vaga.tipo_cama}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Datas:</span>
                          <span>
                            {format(parseISO(item.data_inicio), 'dd/MM')} - {format(parseISO(item.data_fim), 'dd/MM')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Preço:
                          </span>
                          <span>
                            {nights} noite{nights > 1 ? 's' : ''} x R$
                            {pricePerNight.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span className="text-foreground">Subtotal:</span>
                          <span>R$ {itemTotal.toFixed(2)}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive w-full"
                          onClick={() => removeCartItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remover
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto border-t pt-4 space-y-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={async () => await clearCart()}
                  className="w-full"
                >
                  Limpar Carrinho
                </Button>
                <Button onClick={handleCheckout} className="w-full" disabled={cart.length === 0}>
                  Finalizar Compra
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/50" />
            <div>
              <p className="text-lg font-semibold">Seu carrinho está vazio</p>
              <p className="text-sm text-muted-foreground">
                Adicione algumas vagas para começar.
              </p>
            </div>
            <Link href="/booking">
              <Button>Ver Quartos</Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
