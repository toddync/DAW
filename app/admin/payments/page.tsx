"use client"

import { useEffect, useState, useCallback } from "react"
import { Pagamento } from "@/lib/types"
import { getColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

interface PaginatedResponse {
  data: Pagamento[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function PaymentsAdminPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Pagination state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  
  const { toast } = useToast()

  const fetchPagamentos = useCallback(async (currentPage: number = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/payments?page=${currentPage}&limit=20`, { cache: 'no-store' })
      if (!response.ok) throw new Error("Falha ao carregar os pagamentos.")
      
      const data: PaginatedResponse = await response.json()
      
      setPagamentos(data.data)
      setPage(data.page)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPagamentos(page)
  }, [page, fetchPagamentos])

  const handleUpdateStatus = async (pagamento: Pagamento, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${pagamento.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Falha ao atualizar o status do pagamento.");
      toast({ title: "Sucesso", description: `Status atualizado para ${newStatus}.` });
      await fetchPagamentos(page);
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
          <>
            <DataTable columns={columns} data={pagamentos} />
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {pagamentos.length} de {total} registros (Página {page} de {totalPages})
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
