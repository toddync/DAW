"use client"

import { useEffect, useState } from "react"
import { Pagamento } from "@/lib/types"
import { getColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function PaymentsAdminPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchPagamentos = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/payments")
      if (!response.ok) throw new Error("Falha ao carregar os pagamentos.")
      const data = await response.json()
      setPagamentos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPagamentos()
  }, [])

  const handleUpdateStatus = async (pagamento: Pagamento, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${pagamento.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Falha ao atualizar o status do pagamento.");
      toast({ title: "Sucesso", description: `Status atualizado para ${newStatus}.` });
      await fetchPagamentos();
    } catch (err) {
      toast({ variant: "destructive", title: "Erro", description: err instanceof Error ? err.message : "Ocorreu um erro." });
    }
  }

  const columns = getColumns(handleUpdateStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Pagamentos</CardTitle>
        <CardDescription>Visualize e gerencie os pagamentos do sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-destructive text-center">{error}</p>
        ) : (
          <DataTable columns={columns} data={pagamentos} />
        )}
      </CardContent>
    </Card>
  )
}
