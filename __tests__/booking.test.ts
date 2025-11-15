import { render, screen, waitFor } from '@testing-library/react'
import BookingPage from '../app/booking/page'
import { useBookingStore } from '@/lib/store'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createPagesBrowserClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    },
  }),
}))

describe('BookingPage', () => {
  beforeEach(() => {
    useBookingStore.setState({
      dateRange: { start: '2024-12-10', end: '2024-12-15' },
      filters: { bedTypes: new Set(), amenities: new Set() },
    })
  })

  it('should redirect to /login if user is not authenticated', async () => {
    render(<BookingPage />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })
})
