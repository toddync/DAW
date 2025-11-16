'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useBookingStore } from '@/lib/store'

const BED_TYPES = [
  { id: 'solteiro', label: 'Solteiro' },
  { id: 'superior', label: 'Beliche Superior' },
  { id: 'inferior', label: 'Beliche Inferior' },
]

const COMMON_AMENITIES = [
    { id: 'WIFI_GRATIS', label: 'Wi-Fi Grátis' },
    { id: 'AR_CONDICIONADO', label: 'Ar Condicionado' },
    { id: 'BANHEIRO_PRIV', label: 'Banheiro Privativo' },
    { id: 'QUARTO_FEMININO', label: 'Quarto Feminino' },
    { id: 'ARMARIO_INDIVIDUAL', label: 'Armário Individual' },
    { id: 'ACESSIBILIDADE', label: 'Acessibilidade' },
]

export function FilterSidebar() {
  const { filters, toggleBedType, toggleAmenity, clearFilters } = useBookingStore()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipo de Cama</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {BED_TYPES.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={`bed-${type.id}`}
                checked={filters.bedTypes.has(type.id)}
                onCheckedChange={() => toggleBedType(type.id)}
              />
              <label
                htmlFor={`bed-${type.id}`}
                className="text-sm cursor-pointer text-foreground"
              >
                {type.label}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comodidades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {COMMON_AMENITIES.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity.id}`}
                checked={filters.amenities.has(amenity.id)}
                onCheckedChange={() => toggleAmenity(amenity.id)}
              />
              <label
                htmlFor={`amenity-${amenity.id}`}
                className="text-sm cursor-pointer text-foreground"
              >
                {amenity.label}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {(filters.bedTypes.size > 0 || filters.amenities.size > 0) && (
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Limpar Filtros
        </Button>
      )}
    </div>
  )
}
