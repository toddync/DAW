'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
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
import { Separator } from '@/components/ui/separator'
import { PaymentModal } from './payment-modal'
import { Bed } from '@/lib/types'
import Link from 'next/link'

export function CartSidebar() {
  const { cart, fetchCart, removeCartItem, clearCart, clearCartFromStore } = useBookingStore()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [
    selectedItem,
    setSelectedItem,
  ] = useState<{
    bed: Bed
    dateRange: { start: string | null; end: string | null }
    totalPrice: number
  } | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchUserAndCart = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchCart()
      }
    }
    fetchUserAndCart()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const newUser = session?.user || null
      setUser(newUser)
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        fetchCart()
      }
      if (event === 'SIGNED_OUT') {
        useBookingStore.getState().clearCartFromStore()
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase, fetchCart])

  const calculateNights = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    )
  }

  const totalItems = cart.length
  const cartTotal = cart.reduce((total, item) => {
    if (item.dateRange.start && item.dateRange.end) {
      const nights = calculateNights(item.dateRange.start, item.dateRange.end)
      return total + nights * item.bed.price_per_night
    }
    return total
  }, 0)

  const handleCheckout = () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (cart.length > 0) {
      const firstItem = cart[0]
      if (firstItem.dateRange.start && firstItem.dateRange.end) {
        const nights = calculateNights(
          firstItem.dateRange.start,
          firstItem.dateRange.end
        )
        setSelectedItem({
          bed: firstItem.bed,
          dateRange: firstItem.dateRange,
          totalPrice: nights * firstItem.bed.price_per_night,
        })
        setShowPaymentModal(true)
      }
    }
  }

  return (
    <>
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
            <SheetTitle>Your Cart ({totalItems})</SheetTitle>
          </SheetHeader>
          {cart.length > 0 ? (
            <>
              <ScrollArea className="flex-grow -mr-6 pr-6">
                <div className="space-y-4">
                  {cart.map((item) => {
                    const nights =
                      item.dateRange.start && item.dateRange.end
                        ? calculateNights(
                            item.dateRange.start,
                            item.dateRange.end
                          )
                        : 0
                    const itemTotal = nights * item.bed.price_per_night
                    return (
                      <Card key={item.bed.id} className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-base">
                            {item.bed.label}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Dates:</span>
                            <span>
                              {item.dateRange.start} - {item.dateRange.end}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Price:
                            </span>
                            <span>
                              {nights} night{nights > 1 ? 's' : ''} at $
                              {item.bed.price_per_night.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span className="text-foreground">Item Total:</span>
                            <span>${itemTotal.toFixed(2)}</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive w-full"
                            onClick={() => removeCartItem(item.cart_item_id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
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
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={async () => await clearCart()}
                    className="w-full"
                  >
                    Clear Cart
                  </Button>
                  <Button onClick={handleCheckout} className="w-full">
                    Checkout
                  </Button>
                </div>
              </SheetFooter>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingCart className="w-16 h-16 text-muted-foreground/50" />
              <div>
                <p className="text-lg font-semibold">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">
                  Add some beds to get started.
                </p>
              </div>
              <Link href="/booking">
                <Button>Browse Rooms</Button>
              </Link>
            </div>
          )}
        </SheetContent>
      </Sheet>
      {selectedItem && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={async () => {
            setShowPaymentModal(false)
            // In a real app, you'd create bookings for all cart items
            // and then clear the cart.
            await clearCart()
          }}
          totalPrice={selectedItem.totalPrice}
          bed={selectedItem.bed}
          dateRange={selectedItem.dateRange}
        />
      )}
    </>
  )
}
