'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, BedDouble, Calendar, Home } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

interface Reservation {
  id: string
  start_date: string
  end_date: string
  bed: {
    id: string
    label: string
    price_per_night: number
    room: {
      id: string
      name: string
    }
  }
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const checkAuthAndFetchReservations = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      try {
        setLoading(true)
        const response = await fetch('/api/reservations')
        if (!response.ok) throw new Error('Failed to fetch reservations')

        const data = await response.json()
        setReservations(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchReservations()
  }, [supabase, router])

  const today = new Date()
  const activeReservations = reservations.filter(
    (r) => new Date(r.end_date) >= today
  )
  const pastReservations = reservations.filter(
    (r) => new Date(r.end_date) < today
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-lg">Loading your reservations...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-16 bg-card z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Your Reservations</h1>
          <p className="text-muted-foreground mt-2">
            View your active and past bookings.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-destructive">{error}</div>
          </div>
        )}

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Active Reservations</h2>
          {activeReservations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeReservations.map((res) => (
                <Card key={res.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      {res.bed.room.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <BedDouble className="w-4 h-4 text-muted-foreground" />
                      <span>{res.bed.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{res.start_date} to {res.end_date}</span>
                    </div>
                    <Badge>Active</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">You have no active reservations.</p>
          )}
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Past Reservations</h2>
          {pastReservations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastReservations.map((res) => (
                <Card key={res.id} className="opacity-70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      {res.bed.room.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <BedDouble className="w-4 h-4 text-muted-foreground" />
                      <span>{res.bed.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{res.start_date} to {res.end_date}</span>
                    </div>
                    <Badge variant="outline">Past</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">You have no past reservations.</p>
          )}
        </section>
      </main>
    </div>
  )
}
