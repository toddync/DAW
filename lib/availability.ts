/**
 * Check if a date range conflicts with existing bookings
 * Conflict detection logic: NOT (end_date <= start OR start_date >= end)
 * This ensures no overlapping bookings on the same bed
 */
export function checkDateRangeOverlap(
  bookingStart: string,
  bookingEnd: string,
  checkStart: string,
  checkEnd: string
): boolean {
  const bookStart = new Date(bookingStart)
  const bookEnd = new Date(bookingEnd)
  const checkS = new Date(checkStart)
  const checkE = new Date(checkEnd)

  // No conflict if: end_date <= start OR start_date >= end
  const noConflict = bookEnd <= checkS || bookStart >= checkE
  return !noConflict // Return true if there IS a conflict
}

/**
 * Calculate the number of nights between two dates (exclusive end date)
 */
export function calculateNights(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const ms = end.getTime() - start.getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

/**
 * Calculate total booking cost
 */
export function calculateTotalPrice(pricePerNight: number, nights: number): number {
  return pricePerNight * nights
}

/**
 * Validate date range for booking
 */
export function validateDateRange(startDate: string, endDate: string): string | null {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (start < today) {
    return 'Start date cannot be in the past'
  }

  if (start >= end) {
    return 'Start date must be before end date'
  }

  return null
}
