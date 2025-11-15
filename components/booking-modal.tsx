'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Bed, Profile } from '@/lib/types'
import { useBookingStore } from '@/lib/store'
import { getSupabaseClient } from '@/lib/supabase-client'
import { PaymentModal } from './payment-modal'

interface BookingModalProps {
  bed: Bed
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ bed, isOpen, onClose }: BookingModalProps) {
  const { dateRange, isBooking, setIsBooking } = useBookingStore()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState<Profile | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setUser(profile)
      }
    }
    fetchUser()
  }, [supabase])

  if (!dateRange.start || !dateRange.end) {
    return null
  }

  const startDate = new Date(dateRange.start)
  const endDate = new Date(dateRange.end)
  const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const totalPrice = nights * bed.price_per_night

  const handleBooking = async () => {
    if (!user) {
      setError('You must be logged in to book a bed.')
      return
    }

    setIsBooking(true)
    setError(null)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bedId: bed.id,
          startDate: dateRange.start,
          endDate: dateRange.end,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Booking failed')
      }

      setShowPaymentModal(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsBooking(false)
    }
  }

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    setSuccess(true)
    setTimeout(() => {
      onClose()
      setSuccess(false)
    }, 2000)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
      setError(null)
      setSuccess(false)
      setShowPaymentModal(false)
    }
  }

  if (showPaymentModal) {
    return (
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        totalPrice={totalPrice}
        bed={bed}
        dateRange={dateRange}
      />
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book {bed.label}</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="text-green-600 text-lg font-semibold">Booking confirmed!</div>
            <p className="text-sm text-muted-foreground">Thank you for your reservation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Booking Summary */}
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in:</span>
                  <span className="font-medium text-foreground">{dateRange.start}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out:</span>
                  <span className="font-medium text-foreground">{dateRange.end}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 mt-2">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-foreground">{nights} night{nights > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price per night:</span>
                  <span className="font-medium text-foreground">${bed.price_per_night.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Price Breakdown */}
            <Card className="p-4 bg-primary/5 border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Total Price:</span>
                <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </Card>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="text-sm text-destructive">{error}</div>
              </div>
            )}

            {user && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Booking for <span className="font-semibold text-foreground">{user.full_name}</span>
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex gap-2">
          {!success && (
            <>
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isBooking}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBooking}
                disabled={isBooking || !user}
                className="flex-1"
              >
                {isBooking ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
