// app/admin/packages/templates/page.tsx
"use client"

import { useEffect, useState, useCallback } from "react"
import { Pacote } from "@/lib/types"
import { getColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { PlusCircle, Loader2, ArrowLeft } from "lucide-react"
import { TemplateForm } from "./template-form"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function PackageTemplatesPage() {
    const [pacotes, setPacotes] = useState<Pacote[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
    const [selectedPacote, setSelectedPacote] = useState<Partial<Pacote> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { toast } = useToast()

    const fetchPacotes = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/packages/templates', { cache: 'no-store' })
            if (!response.ok) throw new Error("Falha ao carregar os templates de pacotes.")

            const data: Pacote[] = await response.json()
            setPacotes(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPacotes()
    }, [fetchPacotes])

    const handleCreate = () => {
        setSelectedPacote(null)
        setIsFormOpen(true)
    }

    const handleEdit = (pacote: Pacote) => {
        setSelectedPacote(pacote)
        setIsFormOpen(true)
    }

    const handleDelete = (pacote: Pacote) => {
        setSelectedPacote(pacote)
        setIsConfirmDeleteOpen(true)
    }

    const onConfirmDelete = async () => {
        if (!selectedPacote?.id) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/admin/packages/templates/${selectedPacote.id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Falha ao deletar o template de pacote.");
            toast({ title: "Sucesso", description: "Template de pacote deletado." });
            await fetchPacotes();
        } catch (err) {
            toast({ variant: "destructive", title: "Erro", description: err instanceof Error ? err.message : "Ocorreu um erro." });
        } finally {
            setIsSubmitting(false);
            setIsConfirmDeleteOpen(false);
        }
    }

    const onSubmit = async (values: any) => {
        setIsSubmitting(true);
        const isEditing = !!selectedPacote?.id;
        const url = isEditing ? `/api/admin/packages/templates/${selectedPacote.id}` : '/api/admin/packages/templates';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || `Falha ao ${isEditing ? 'atualizar' : 'criar'} o template de pacote.`);
            }

            toast({ title: "Sucesso", description: `Template de pacote ${isEditing ? 'atualizado' : 'criado'}.` });
            setIsFormOpen(false);
            await fetchPacotes();
        } catch (err) {
            toast({ variant: "destructive", title: "Erro", description: err instanceof Error ? err.message : "Ocorreu um erro." });
        } finally {
            setIsSubmitting(false);
        }
    }

    const columns = getColumns(handleEdit, handleDelete);

    return (
        <>
            <div className="mb-4">
                <Button variant="ghost" asChild>
                    <Link href="/admin/packages">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para Pacotes de Quartos
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Gerenciar Templates de Pacotes</CardTitle>
                        <CardDescription>Crie e edite os templates de pacotes que serão associados aos quartos.</CardDescription>
                    </div>
                    <Button onClick={handleCreate}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Criar Novo Template
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
                        <DataTable columns={columns} data={pacotes} />
                    )}
                </CardContent>
            </Card>

            {/* Dialog para Criar/Editar */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{selectedPacote?.id ? 'Editar Template' : 'Criar Novo Template'}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <TemplateForm
                            initialData={selectedPacote ?? undefined}
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
                            Tem certeza que deseja deletar o template "{selectedPacote?.nome}"? Isso pode afetar pacotes de quartos existentes.
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
