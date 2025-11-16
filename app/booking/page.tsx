'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AlertCircle, Bed, Calendar, Home } from 'lucide-react'

import { useBookingStore } from '@/lib/store'
import { QuartoComVagas, Vaga } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/date-range-picker'
import { FilterSidebar } from '@/components/filter-sidebar'
import { Skeleton } from '@/components/ui/skeleton'

function RoomSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="pt-2 border-t border-border">
          <Skeleton className="h-5 w-1/2" />
        </div>
        <Skeleton className="h-10 w-full mt-4" />
      </CardContent>
    </Card>
  )
}

export default function BookingPage() {
  const [quartos, setQuartos] = useState<QuartoComVagas[]>([])
  const [filteredQuartos, setFilteredQuartos] = useState<QuartoComVagas[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { dateRange, filters } = useBookingStore()

  useEffect(() => {
    async function fetchQuartos() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (dateRange.start) params.append('start', dateRange.start)
        if (dateRange.end) params.append('end', dateRange.end)

        const response = await fetch(`/api/rooms?${params}`)
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Falha ao buscar quartos');
        }

        const data: QuartoComVagas[] = await response.json()
        setQuartos(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchQuartos()
  }, [dateRange])

  useEffect(() => {
    let filtered = quartos

    // Lógica de filtro para tipo de cama
    if (filters.bedTypes.size > 0) {
      filtered = filtered.map((quarto) => ({
        ...quarto,
        vagas: quarto.vagas.filter((vaga) => filters.bedTypes.has(vaga.tipo_cama)),
      })).filter(quarto => quarto.vagas.length > 0);
    }

    // Lógica de filtro para comodidades
    if (filters.amenities.size > 0) {
      filtered = filtered.filter((quarto) =>
        Array.from(filters.amenities).every((amenityCode) =>
          quarto.caracteristicas.some(c => c.caracteristica.codigo === amenityCode)
        )
      )
    }

    setFilteredQuartos(filtered)
  }, [quartos, filters])

  const getAvailableCount = (vagas: Vaga[]) => {
    if (!dateRange.start || !dateRange.end) return vagas.length;
    return vagas.filter((v) => v.available).length
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-16 bg-card z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Quartos Disponíveis</h1>
          <div className="text-muted-foreground mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {dateRange.start && dateRange.end
              ? `Visualizando disponibilidade de ${dateRange.start} a ${dateRange.end}`
              : 'Selecione um período para consultar os preços e a disponibilidade'}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-4 max-h-fit lg:sticky top-32">
            <DateRangePicker />
            <FilterSidebar />
          </aside>

          <div className="flex-1 min-w-0">
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <div className="text-destructive font-medium">{error}</div>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RoomSkeleton />
                <RoomSkeleton />
              </div>
            ) : filteredQuartos.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                <p className="text-muted-foreground text-lg">
                  {quartos.length === 0 ? 'Nenhum quarto disponível no momento' : 'Nenhum quarto corresponde aos seus filtros'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredQuartos.map((quarto) => (
                  <Link href={`/rooms/${quarto.id}`} key={quarto.id}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
                      <div className="relative h-48 w-full bg-muted overflow-hidden">
                        <Image
                          src={quarto.images?.[0] || "/placeholder.svg"}
                          alt={`Foto do Quarto Nº ${quarto.numero}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Home className="w-5 h-5 text-primary" />
                          Quarto Nº {quarto.numero}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{quarto.descricao}</p>

                        <div className="flex flex-wrap gap-2">
                          {quarto.caracteristicas.slice(0, 3).map(({ caracteristica }) => (
                            <Badge key={caracteristica.codigo} variant="outline" className="text-xs">
                              {caracteristica.nome}
                            </Badge>
                          ))}
                          {quarto.caracteristicas.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{quarto.caracteristicas.length - 3} mais
                            </Badge>
                          )}
                        </div>

                        <div className="pt-2 border-t border-border">
                          <div className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Bed className="w-4 h-4" />
                            <span>{getAvailableCount(quarto.vagas)} de {quarto.vagas.length} vagas disponíveis</span>
                          </div>
                          <p className="text-lg font-bold text-primary mt-1">
                            A partir de R$ {quarto.preco_base.toFixed(2)}
                            <span className="text-xs font-normal text-muted-foreground"> / noite</span>
                          </p>
                        </div>

                        <Button className="w-full mt-4" variant="default">
                          Ver Detalhes
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
