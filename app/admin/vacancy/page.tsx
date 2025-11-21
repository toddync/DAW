"use client"

import { useEffect, useState } from "react"
import { ControleOcupacao } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export default function VacancyAdminPage() {
  const [ocupacao, setOcupacao] = useState<ControleOcupacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())

  const fetchOcupacao = async () => {
    if (!date) return
    try {
      setLoading(true)
      // Fetch for the whole month to allow easy switching, or just the day?
      // Let's fetch for the selected day to be precise as per requirement "defaulting to the current day"
      // Actually, fetching the whole month is better for the calendar indicators if we wanted them,
      // but for now let's just fetch the specific day to be lightweight and simple.
      // Wait, the API expects a range. Let's fetch the whole month of the selected date
      // so we don't spam the API if the user clicks around in the same month.
      const start = startOfMonth(date)
      const end = endOfMonth(date)

      const response = await fetch(`/api/admin/vacancy?inicio=${start.toISOString()}&fim=${end.toISOString()}`)
      if (!response.ok) throw new Error("Falha ao carregar dados de ocupação.")
      const data = await response.json()
      setOcupacao(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOcupacao()
  }, [date?.getMonth(), date?.getFullYear(), date]) // Refetch when month changes

  // Helper to parse date string to local midnight to avoid timezone issues
  const parseDateToLocal = (dateString: string) => {
    // Assuming dateString is ISO like '2023-10-27T00:00:00.000Z' or '2023-10-27'
    const datePart = dateString.split('T')[0]
    const [year, month, day] = datePart.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  // Filter occupancy for the selected date
  const selectedDateStr = date ? format(date, 'yyyy-MM-dd') : ''
  const ocupacaoDoDia = ocupacao.filter(item => {
    const itemDate = parseDateToLocal(item.data_referencia)
    return format(itemDate, 'yyyy-MM-dd') === selectedDateStr
  })

  // Calculate modifiers for the calendar
  const modifiers = {
    booked: [] as Date[],
    partially_booked: [] as Date[],
    free: [] as Date[],
  }

  const occupancyByDate = ocupacao.reduce((acc, item) => {
    const itemDate = parseDateToLocal(item.data_referencia)
    const dateStr = format(itemDate, 'yyyy-MM-dd')

    if (!acc[dateStr]) {
      acc[dateStr] = { total: 0, occupied: 0, available: 0 }
    }
    acc[dateStr].total += item.vagas_ocupadas + item.vagas_disponiveis
    acc[dateStr].occupied += item.vagas_ocupadas
    acc[dateStr].available += item.vagas_disponiveis
    return acc
  }, {} as Record<string, { total: number, occupied: number, available: number }>)

  Object.entries(occupancyByDate).forEach(([dateStr, stats]) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)

    if (stats.available === 0 && stats.total > 0) {
      modifiers.booked.push(dateObj)
    } else if (stats.occupied > 0) {
      modifiers.partially_booked.push(dateObj)
    } else {
      modifiers.free.push(dateObj)
    }
  })

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Controle de Ocupação</h1>
        <p className="text-muted-foreground">Selecione uma data para visualizar a disponibilidade.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Card className="w-full md:w-auto">
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              locale={ptBR}
              modifiers={modifiers}
              modifiersClassNames={{
                booked: "bg-red-100 text-red-900 hover:bg-red-200 font-bold",
                partially_booked: "bg-yellow-100 text-yellow-900 hover:bg-yellow-200 font-bold",
                free: "bg-green-100 text-green-900 hover:bg-green-200 font-bold",
              }}
            />
          </CardContent>
        </Card>

        <Card className="flex-1 w-full">
          <CardHeader>
            <CardTitle>
              Ocupação para {date ? format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'Selecione uma data'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <p className="text-destructive text-center">{error}</p>
            ) : ocupacaoDoDia.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhum dado encontrado para esta data.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ocupacaoDoDia.map((item) => {
                  const total = item.vagas_ocupadas + item.vagas_disponiveis
                  const percent = total > 0 ? (item.vagas_ocupadas / total) * 100 : 0

                  let statusColor = "bg-green-500"
                  if (percent >= 100) statusColor = "bg-red-500"
                  else if (percent >= 50) statusColor = "bg-yellow-500"

                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="space-y-1">
                        <p className="font-medium leading-none">Quarto {item.quartos?.numero}</p>
                        <p className="text-sm text-muted-foreground">{item.quartos?.tipo_quarto}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{item.vagas_disponiveis} vagas livres</p>
                          <p className="text-xs text-muted-foreground">{item.vagas_ocupadas} ocupadas</p>
                        </div>
                        <div className={cn("w-2 h-2 rounded-full", statusColor)} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
