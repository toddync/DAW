'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useBookingStore } from '@/lib/store'

const BED_TYPES = ['single', 'couple', 'bunk']
const COMMON_AMENITIES = ['wifi', 'air_conditioning', 'heating', 'minibar', 'safe', 'balcony']

export function FilterSidebar() {
  const { filters, toggleBedType, toggleAmenity, clearFilters } = useBookingStore()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bed Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {BED_TYPES.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`bed-${type}`}
                checked={filters.bedTypes.has(type)}
                onCheckedChange={() => toggleBedType(type)}
              />
              <label
                htmlFor={`bed-${type}`}
                className="text-sm capitalize cursor-pointer text-foreground"
              >
                {type}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Amenities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {COMMON_AMENITIES.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={filters.amenities.has(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <label
                htmlFor={`amenity-${amenity}`}
                className="text-sm capitalize cursor-pointer text-foreground"
              >
                {amenity.replace('_', ' ')}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {(filters.bedTypes.size > 0 || filters.amenities.size > 0) && (
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Clear Filters
        </Button>
      )}
    </div>
  )
}
