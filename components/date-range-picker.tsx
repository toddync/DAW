'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useBookingStore } from '@/lib/store'

export function DateRangePicker() {
  const { dateRange, setDateRange } = useBookingStore()

  const startOfDay = (date: Date) => {
    const newDate = new Date(date)
    newDate.setHours(0, 0, 0, 0)
    return newDate
  }

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: dateRange.start ? new Date(dateRange.start.replace(/-/g, '/')) : undefined,
    to: dateRange.end ? new Date(dateRange.end.replace(/-/g, '/')) : undefined,
  })
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (date?.from) {
      const today = startOfDay(new Date())
      if (startOfDay(date.from) < today) {
        setError('Start date cannot be in the past')
        return
      }
    }

    if (date?.from && date?.to) {
      if (date.from >= date.to) {
        setError('Start date must be before end date')
        return
      }

      const start = format(date.from, 'yyyy-MM-dd')
      const end = format(date.to, 'yyyy-MM-dd')
      setDateRange(start, end)
      setError(null)
    } else {
      // Clear date range if only one date is selected
      setDateRange(null, null)
      setError(null)
    }
  }, [date, setDateRange])

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {error && <div className="text-sm text-destructive mt-2">{error}</div>}
    </div>
  )
}
