// app/admin/packages/page.tsx
"use client"

import { useEffect, useState } from "react"
import { PacoteQuarto } from "@/lib/types"
import { getColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { PlusCircle, Loader2 } from "lucide-react"
import { PackageForm } from "./package-form"
import { useToast } from "@/components/ui/use-toast"

export default function PackagesAdminPage() {
  const [pacoteQuartos, setPacoteQuartos] = useState<PacoteQuarto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [selectedPacoteQuarto, setSelectedPacoteQuarto] = useState<Partial<PacoteQuarto> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const fetchPacoteQuartos = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/packages")
      if (!response.ok) throw new Error("Falha ao carregar os pacotes de quartos.")
      const data = await response.json()
      setPacoteQuartos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPacoteQuartos()
  }, [])

  const handleCreate = () => {
    setSelectedPacoteQuarto(null)
    setIsFormOpen(true)
  }

  const handleEdit = (pacoteQuarto: PacoteQuarto) => {
    setSelectedPacoteQuarto(pacoteQuarto)
    setIsFormOpen(true)
  }

  const handleDelete = (pacoteQuarto: PacoteQuarto) => {
    setSelectedPacoteQuarto(pacoteQuarto)
    setIsConfirmDeleteOpen(true)
  }

  const onConfirmDelete = async () => {
    if (!selectedPacoteQuarto?.id) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/packages/${selectedPacoteQuarto.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Falha ao deletar o pacote de quarto.");
      toast({ title: "Sucesso", description: "Pacote de quarto deletado." });
      await fetchPacoteQuartos();
    } catch (err) {
      toast({ variant: "destructive", title: "Erro", description: err instanceof Error ? err.message : "Ocorreu um erro." });
    } finally {
      setIsSubmitting(false);
      setIsConfirmDeleteOpen(false);
    }
  }

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    const isEditing = !!selectedPacoteQuarto?.id;
    const url = isEditing ? `/api/admin/packages/${selectedPacoteQuarto.id}` : '/api/admin/packages';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const formattedValues = {
        ...values,
        data_inicio: format(values.data_inicio, 'yyyy-MM-dd'),
        data_fim: format(values.data_fim, 'yyyy-MM-dd'),
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedValues),
      });
      if (!response.ok) throw new Error(`Falha ao ${isEditing ? 'atualizar' : 'criar'} o pacote de quarto.`);
      toast({ title: "Sucesso", description: `Pacote de quarto ${isEditing ? 'atualizado' : 'criado'}.` });
      setIsFormOpen(false);
      await fetchPacoteQuartos();
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
            <CardTitle>Gerenciar Pacotes de Quartos</CardTitle>
            <CardDescription>Visualize, crie, edite e delete os pacotes de quartos disponíveis.</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Criar Novo Pacote de Quarto
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
            <DataTable columns={columns} data={pacoteQuartos} />
          )}
        </CardContent>
      </Card>

      {/* Dialog para Criar/Editar */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedPacoteQuarto?.id ? 'Editar Pacote de Quarto' : 'Criar Novo Pacote de Quarto'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <PackageForm 
              initialData={selectedPacoteQuarto ?? undefined} 
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
              Tem certeza que deseja deletar o pacote de quarto "{selectedPacoteQuarto?.pacotes?.nome}" para o quarto "{selectedPacoteQuarto?.quartos?.numero}"? Esta ação não pode ser desfeita.
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
