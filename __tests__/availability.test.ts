import { checkDateRangeOverlap, calculateNights, calculateTotalPrice, validateDateRange } from '@/lib/availability'

describe('Availability Logic', () => {
  describe('checkDateRangeOverlap', () => {
    it('should detect overlap when booking is completely within range', () => {
      const result = checkDateRangeOverlap('2024-12-10', '2024-12-15', '2024-12-05', '2024-12-20')
      expect(result).toBe(true)
    })

    it('should detect overlap when booking starts before but ends during range', () => {
      const result = checkDateRangeOverlap('2024-12-08', '2024-12-12', '2024-12-10', '2024-12-15')
      expect(result).toBe(true)
    })

    it('should detect overlap when booking starts during and ends after range', () => {
      const result = checkDateRangeOverlap('2024-12-12', '2024-12-20', '2024-12-10', '2024-12-15')
      expect(result).toBe(true)
    })

    it('should not detect overlap when booking ends before range starts', () => {
      const result = checkDateRangeOverlap('2024-12-05', '2024-12-08', '2024-12-10', '2024-12-15')
      expect(result).toBe(false)
    })

    it('should not detect overlap when booking starts after range ends', () => {
      const result = checkDateRangeOverlap('2024-12-20', '2024-12-25', '2024-12-10', '2024-12-15')
      expect(result).toBe(false)
    })

    it('should not detect overlap when dates are touching (exclusive end date)', () => {
      // End date is exclusive, so 2024-12-10 check-out is fine with 2024-12-10 check-in
      const result = checkDateRangeOverlap('2024-12-10', '2024-12-15', '2024-12-05', '2024-12-10')
      expect(result).toBe(false)
    })
  })

  describe('calculateNights', () => {
    it('should calculate correct number of nights', () => {
      const nights = calculateNights('2024-12-10', '2024-12-15')
      expect(nights).toBe(5)
    })

    it('should handle single night booking', () => {
      const nights = calculateNights('2024-12-10', '2024-12-11')
      expect(nights).toBe(1)
    })

    it('should handle longer bookings', () => {
      const nights = calculateNights('2024-12-01', '2024-12-31')
      expect(nights).toBe(30)
    })
  })

  describe('calculateTotalPrice', () => {
    it('should calculate total price correctly', () => {
      const total = calculateTotalPrice(50, 5)
      expect(total).toBe(250)
    })

    it('should handle single night', () => {
      const total = calculateTotalPrice(75.50, 1)
      expect(total).toBe(75.50)
    })
  })

  describe('validateDateRange', () => {
    it('should reject past dates', () => {
      const error = validateDateRange('2020-01-01', '2020-01-10')
      expect(error).toBe('Start date cannot be in the past')
    })

    it('should reject if start >= end', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 5)
      const dateStr = futureDate.toISOString().split('T')[0]

      const error = validateDateRange(dateStr, dateStr)
      expect(error).toBe('Start date must be before end date')
    })

    it('should accept valid future date range', () => {
      const start = new Date()
      start.setDate(start.getDate() + 5)
      const end = new Date()
      end.setDate(end.getDate() + 10)

      const startStr = start.toISOString().split('T')[0]
      const endStr = end.toISOString().split('T')[0]

      const error = validateDateRange(startStr, endStr)
      expect(error).toBeNull()
    })
  })
})
