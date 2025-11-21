"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Usuario } from "@/lib/types"
import { getColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { CustomerForm } from "./customer-form"
import { useToast } from "@/components/ui/use-toast"
import { CustomerUpdateInput } from "@/lib/schemas/customer"
import { api, APIClientError } from "@/lib/api-client"
import { Button } from "@/components/ui/button"

interface PaginatedResponse {
  data: Usuario[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function CustomersAdminPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null> (null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const { toast } = useToast()

  const fetchUsuarios = useCallback(async (currentPage: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.get<PaginatedResponse>(
        `/api/admin/customers?page=${currentPage}&limit=20`,
        { cache: 'no-store' }
      )
      
      setUsuarios(response.data)
      setPage(response.page)
      setTotalPages(response.totalPages)
      setTotal(response.total)
    } catch (err) {
      if (err instanceof APIClientError) {
        setError(err.message)
      } else {
        setError("Falha ao carregar os usuários. Por favor, tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsuarios(page)
  }, [page, fetchUsuarios])

  const handleEdit = useCallback((usuario: Usuario) => {
    setSelectedUsuario(usuario)
    setIsFormOpen(true)
  }, [])

  const onSubmit = async (values: CustomerUpdateInput) => {
    if (!selectedUsuario) return;
    setIsSubmitting(true);

    try {
      await api.put(`/api/admin/customers/${selectedUsuario.id}`, values);
      
      toast({ 
        title: "Sucesso", 
        description: "Usuário atualizado com sucesso." 
      });
      
      setIsFormOpen(false);
      await fetchUsuarios(page);
    } catch (err) {
      const message = err instanceof APIClientError 
        ? err.message 
        : "Falha ao atualizar usuário. Por favor, verifique os dados e tente novamente.";
      
      toast({ 
        variant: "destructive", 
        title: "Erro ao Atualizar", 
        description: message 
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Memoize columns to prevent recreation on every render
  const columns = useMemo(() => getColumns(handleEdit), [handleEdit]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Clientes</CardTitle>
          <CardDescription>Visualize e gerencie os usuários do sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Carregando...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => fetchUsuarios(page)} variant="outline">
                Tentar Novamente
              </Button>
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={usuarios} />
              
              {/* Pagination Controls - Nielsen Heuristic #1: Visibility */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {usuarios.length} de {total} registros (Página {page} de {totalPages})
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

      {/* Dialog para Editar */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedUsuario && (
              <CustomerForm
                initialData={selectedUsuario}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
