"use client"

import { useEffect, useState, useCallback } from "react"
import { Vaga } from "@/lib/types"
import { getColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { PlusCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { BedForm } from "./bed-form"
import { useToast } from "@/components/ui/use-toast"

interface PaginatedResponse {
  data: Vaga[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function BedsAdminPage() {
  const [vagas, setVagas] = useState<Vaga[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [selectedVaga, setSelectedVaga] = useState<Partial<Vaga> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Pagination state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  
  const { toast } = useToast()

  const fetchVagas = useCallback(async (currentPage: number = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/beds?page=${currentPage}&limit=20`, { cache: 'no-store' })
      if (!response.ok) throw new Error("Falha ao carregar as vagas.")
      
      const data: PaginatedResponse = await response.json()
      
      setVagas(data.data)
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
    fetchVagas(page)
  }, [page, fetchVagas])

  const handleCreate = () => {
    setSelectedVaga(null)
    setIsFormOpen(true)
  }

  const handleEdit = (vaga: Vaga) => {
    setSelectedVaga(vaga)
    setIsFormOpen(true)
  }

  const handleDelete = (vaga: Vaga) => {
    setSelectedVaga(vaga)
    setIsConfirmDeleteOpen(true)
  }

  const onConfirmDelete = async () => {
    if (!selectedVaga?.id) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/beds/${selectedVaga.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Falha ao deletar a vaga.");
      toast({ title: "Sucesso", description: "Vaga deletada." });
      await fetchVagas(page);
    } catch (err) {
      toast({ variant: "destructive", title: "Erro", description: err instanceof Error ? err.message : "Ocorreu um erro." });
    } finally {
      setIsSubmitting(false);
      setIsConfirmDeleteOpen(false);
    }
  }

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    const isEditing = !!selectedVaga?.id;
    const url = isEditing ? `/api/admin/beds/${selectedVaga.id}` : '/api/admin/beds';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(`Falha ao ${isEditing ? 'atualizar' : 'criar'} a vaga.`);
      toast({ title: "Sucesso", description: `Vaga ${isEditing ? 'atualizada' : 'criada'}.` });
      setIsFormOpen(false);
      await fetchVagas(page);
    } catch (err) {
      toast({ variant: "destructive", title: "Erro", description: err instanceof Error ? err.message : "Ocorreu um erro." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const columns = getColumns(handleEdit, handleDelete);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gerenciar Camas/Vagas</CardTitle>
            <CardDescription>Visualize, crie, edite e delete as camas dos quartos.</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Criar Nova Vaga
          </Button>
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
              <DataTable columns={columns} data={vagas} />
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {vagas.length} de {total} registros (Página {page} de {totalPages})
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

      {/* Dialog para Criar/Editar */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedVaga?.id ? 'Editar Vaga' : 'Criar Nova Vaga'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <BedForm
              initialData={selectedVaga ?? undefined}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* AlertDialog para Deletar */}
      <AlertDialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a vaga {selectedVaga?.numero_vaga}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
