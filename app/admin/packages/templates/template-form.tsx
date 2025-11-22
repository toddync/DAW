// app/admin/packages/templates/template-form.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Pacote } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    nome: z.string().min(1, "O nome é obrigatório."),
    descricao: z.string().optional(),
})

type TemplateFormValues = z.infer<typeof formSchema>

interface TemplateFormProps {
    initialData?: Partial<Pacote>;
    onSubmit: (values: TemplateFormValues) => void;
    isSubmitting: boolean;
}

export function TemplateForm({ initialData, onSubmit, isSubmitting }: TemplateFormProps) {
    const form = useForm<TemplateFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: initialData?.nome || "",
            descricao: initialData?.descricao || "",
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome do Pacote</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Pacote Carnaval" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Descrição do pacote..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData?.id ? 'Salvar Alterações' : 'Criar Template'}
                </Button>
            </form>
        </Form>
    )
}
