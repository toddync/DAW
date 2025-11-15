'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CartSidebar } from './cart-sidebar'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'
  const isBooking = pathname === '/booking'
  const isReservations = pathname === '/reservations'
  const [user, setUser] = useState<User | null>(null)
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
  }

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">H</span>
          </div>
          <span className="font-bold text-lg text-foreground">Urban Hostel</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${isHome ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Home
          </Link>
          <Link
            href="/booking"
            className={`text-sm font-medium transition-colors ${isBooking ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Rooms
          </Link>
          {user && (
            <Link
              href="/reservations"
              className={`text-sm font-medium transition-colors ${isReservations ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              My Reservations
            </Link>
          )}
          <CartSidebar />
          {user ? (
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
