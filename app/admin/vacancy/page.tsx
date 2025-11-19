"use client"

import { useEffect, useState } from "react"
import { ControleOcupacao } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function VacancyAdminPage() {
  const [ocupacao, setOcupacao] = useState<ControleOcupacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const fetchOcupacao = async () => {
    try {
      setLoading(true)
      const start = startOfMonth(currentMonth)
      const end = endOfMonth(currentMonth)

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
  }, [currentMonth])

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  // Agrupar ocupação por quarto
  const ocupacaoPorQuarto = ocupacao.reduce((acc, curr) => {
    const quartoId = curr.quarto_id
    if (!acc[quartoId]) {
      acc[quartoId] = {
        quarto: curr.quartos,
        dias: {}
      }
    }
    acc[quartoId].dias[format(new Date(curr.data_referencia), 'yyyy-MM-dd')] = curr
    return acc
  }, {} as Record<string, { quarto: any, dias: Record<string, ControleOcupacao> }>)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Controle de Ocupação</CardTitle>
          <CardDescription>Visualize a disponibilidade dos quartos.</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium min-w-[150px] text-center capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-destructive text-center">{error}</p>
        ) : (
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[200px_1fr] border-b">
              <div className="p-2 font-medium">Quarto</div>
              <div className="grid" style={{ gridTemplateColumns: `repeat(${daysInMonth.length}, minmax(40px, 1fr))` }}>
                {daysInMonth.map((day) => (
                  <div key={day.toString()} className="p-2 text-center text-xs border-l">
                    {format(day, 'dd')}
                    <br />
                    {format(day, 'EEE', { locale: ptBR })}
                  </div>
                ))}
              </div>
            </div>
            {Object.values(ocupacaoPorQuarto).map(({ quarto, dias }) => (
              <div key={quarto?.id || 'unknown'} className="grid grid-cols-[200px_1fr] border-b hover:bg-muted/50">
                <div className="p-2 flex flex-col justify-center">
                  <span className="font-medium">{quarto?.numero || 'N/A'}</span>
                  <span className="text-xs text-muted-foreground">{quarto?.tipo_quarto}</span>
                </div>
                <div className="grid" style={{ gridTemplateColumns: `repeat(${daysInMonth.length}, minmax(40px, 1fr))` }}>
                  {daysInMonth.map((day) => {
                    const dateKey = format(day, 'yyyy-MM-dd')
                    const dadosDia = dias[dateKey]
                    const ocupacaoPercent = dadosDia
                      ? (dadosDia.vagas_ocupadas / (dadosDia.vagas_ocupadas + dadosDia.vagas_disponiveis)) * 100
                      : 0

                    let bgClass = "bg-green-100 text-green-800"
                    if (ocupacaoPercent >= 100) bgClass = "bg-red-100 text-red-800"
                    else if (ocupacaoPercent >= 50) bgClass = "bg-yellow-100 text-yellow-800"
                    else if (!dadosDia) bgClass = "bg-gray-50"

                    return (
                      <div
                        key={day.toString()}
                        className={cn("p-1 text-center text-xs border-l flex items-center justify-center", bgClass)}
                        title={dadosDia ? `Ocupadas: ${dadosDia.vagas_ocupadas}, Livres: ${dadosDia.vagas_disponiveis}` : 'Sem dados'}
                      >
                        {dadosDia ? dadosDia.vagas_disponiveis : '-'}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
