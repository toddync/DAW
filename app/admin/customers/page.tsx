"use client"

import { useEffect, useState } from "react"
import { Usuario } from "@/lib/types"
import { getColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { CustomerForm } from "./customer-form"
import { useToast } from "@/components/ui/use-toast"

export default function CustomersAdminPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const fetchUsuarios = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/customers")
      if (!response.ok) throw new Error("Falha ao carregar os usuários.")
      const data = await response.json()
      setUsuarios(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario)
    setIsFormOpen(true)
  }

  const onSubmit = async (values: any) => {
    if (!selectedUsuario) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/customers/${selectedUsuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Falha ao atualizar o usuário.");
      toast({ title: "Sucesso", description: "Usuário atualizado." });
      setIsFormOpen(false);
      await fetchUsuarios();
    } catch (err) {
      toast({ variant: "destructive", title: "Erro", description: err instanceof Error ? err.message : "Ocorreu um erro." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const columns = getColumns(handleEdit);

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
            </div>
          ) : error ? (
            <p className="text-destructive text-center">{error}</p>
          ) : (
            <DataTable columns={columns} data={usuarios} />
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
