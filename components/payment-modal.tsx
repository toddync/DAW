'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { AlertCircle, Loader2, CreditCard } from 'lucide-react'

import { Bed } from '@/lib/types'
import { useBookingStore } from '@/lib/store'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: () => void
  totalPrice: number
  bed: Bed
  dateRange: {
    start: string | null
    end: string | null
  }
}

export function PaymentModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  totalPrice,
  bed,
  dateRange,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [currentDateRange, setCurrentDateRange] = useState(dateRange)
  const [currentTotalPrice, setCurrentTotalPrice] = useState(totalPrice)

  const handleDateChange = (part: 'start' | 'end', value: string) => {
    const newDateRange = { ...currentDateRange, [part]: value }
    setCurrentDateRange(newDateRange)

    if (newDateRange.start && newDateRange.end) {
      const start = new Date(newDateRange.start)
      const end = new Date(newDateRange.end)
      if (start < end) {
        const nights = Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        )
        setCurrentTotalPrice(nights * bed.price_per_night)
      }
    }
  }

  const handlePayment = async () => {
    setError(null)
    if (!cardNumber || !expiry || !cvc) {
      setError('Please fill in all card details.')
      return
    }

    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    onPaymentSuccess()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
      setError(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Complete Your Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4 bg-muted/50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-muted-foreground">Check-in</label>
                <Input
                  type="date"
                  value={currentDateRange.start || ''}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  className="font-medium text-foreground"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="text-muted-foreground">Check-out</label>
                <Input
                  type="date"
                  value={currentDateRange.end || ''}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  className="font-medium text-foreground"
                  min={currentDateRange.start || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">Total to Pay:</span>
              <span className="text-2xl font-bold text-primary">${currentTotalPrice.toFixed(2)}</span>
            </div>
          </Card>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="text-sm text-destructive">{error}</div>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground">Card Number</label>
              <Input
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground">Expiry</label>
                <Input
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground">CVC</label>
                <Input
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isProcessing}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${currentTotalPrice.toFixed(2)}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
