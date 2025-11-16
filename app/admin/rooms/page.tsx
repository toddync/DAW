"use client"

import { useEffect, useState } from "react"
import { Quarto } from "@/lib/types"
import { getColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { PlusCircle, Loader2 } from "lucide-react"
import { RoomForm } from "./room-form"
import { useToast } from "@/components/ui/use-toast"

export default function RoomsAdminPage() {
  const [quartos, setQuartos] = useState<Quarto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [selectedQuarto, setSelectedQuarto] = useState<Partial<Quarto> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const fetchQuartos = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/quartos")
      if (!response.ok) throw new Error("Falha ao carregar os quartos.")
      const data = await response.json()
      setQuartos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuartos()
  }, [])

  const handleCreate = () => {
    setSelectedQuarto(null)
    setIsFormOpen(true)
  }

  const handleEdit = (quarto: Quarto) => {
    setSelectedQuarto(quarto)
    setIsFormOpen(true)
  }

  const handleDelete = (quarto: Quarto) => {
    setSelectedQuarto(quarto)
    setIsConfirmDeleteOpen(true)
  }

  const onConfirmDelete = async () => {
    if (!selectedQuarto?.id) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/quartos/${selectedQuarto.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Falha ao deletar o quarto.");
      toast({ title: "Sucesso", description: "Quarto deletado." });
      await fetchQuartos();
    } catch (err) {
      toast({ variant: "destructive", title: "Erro", description: err instanceof Error ? err.message : "Ocorreu um erro." });
    } finally {
      setIsSubmitting(false);
      setIsConfirmDeleteOpen(false);
    }
  }

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    const isEditing = !!selectedQuarto?.id;
    const url = isEditing ? `/api/admin/quartos/${selectedQuarto.id}` : '/api/admin/quartos';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(`Falha ao ${isEditing ? 'atualizar' : 'criar'} o quarto.`);
      toast({ title: "Sucesso", description: `Quarto ${isEditing ? 'atualizado' : 'criado'}.` });
      setIsFormOpen(false);
      await fetchQuartos();
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
            <CardTitle>Gerenciar Quartos</CardTitle>
            <CardDescription>Visualize, crie, edite e delete os quartos do albergue.</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Criar Novo Quarto
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
            <DataTable columns={columns} data={quartos} />
          )}
        </CardContent>
      </Card>

      {/* Dialog para Criar/Editar */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedQuarto?.id ? 'Editar Quarto' : 'Criar Novo Quarto'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <RoomForm 
              initialData={selectedQuarto ?? undefined} 
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
              Tem certeza que deseja deletar o quarto "{selectedQuarto?.numero}"? Esta ação não pode ser desfeita e removerá todas as vagas associadas.
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
