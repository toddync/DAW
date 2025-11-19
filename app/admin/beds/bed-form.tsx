"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Vaga, Quarto } from "@/lib/types"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    quarto_id: z.string().min(1, "Selecione um quarto"),
    numero_vaga: z.coerce.number().min(1, "Número da vaga deve ser maior que 0"),
    tipo_cama: z.enum(["superior", "inferior", "solteiro"]),
    posicao: z.enum(["porta", "janela", "centro"]),
    status: z.enum(["disponivel", "ocupada", "manutencao", "reservada"]),
    observacoes: z.string().optional(),
})

interface BedFormProps {
    initialData?: Partial<Vaga>
    onSubmit: (values: z.infer<typeof formSchema>) => void
    isSubmitting: boolean
}

export function BedForm({ initialData, onSubmit, isSubmitting }: BedFormProps) {
    const [quartos, setQuartos] = useState<Quarto[]>([])

    useEffect(() => {
        const fetchQuartos = async () => {
            try {
                const response = await fetch("/api/admin/quartos")
                if (response.ok) {
                    const data = await response.json()
                    setQuartos(data)
                }
            } catch (error) {
                console.error("Failed to fetch rooms", error)
            }
        }
        fetchQuartos()
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quarto_id: initialData?.quarto_id || "",
            numero_vaga: initialData?.numero_vaga || 1,
            tipo_cama: (initialData?.tipo_cama as any) || "solteiro",
            posicao: (initialData?.posicao as any) || "centro",
            status: (initialData?.status as any) || "disponivel",
            observacoes: initialData?.observacoes || "",
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="quarto_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quarto</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um quarto" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {quartos.map((quarto) => (
                                        <SelectItem key={quarto.id} value={quarto.id}>
                                            {quarto.numero} ({quarto.tipo_quarto})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="numero_vaga"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número da Vaga</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="disponivel">Disponível</SelectItem>
                                        <SelectItem value="ocupada">Ocupada</SelectItem>
                                        <SelectItem value="manutencao">Manutenção</SelectItem>
                                        <SelectItem value="reservada">Reservada</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="tipo_cama"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Cama</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="solteiro">Solteiro</SelectItem>
                                        <SelectItem value="superior">Beliche Superior</SelectItem>
                                        <SelectItem value="inferior">Beliche Inferior</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="posicao"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Posição</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a posição" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="centro">Centro</SelectItem>
                                        <SelectItem value="porta">Próximo à Porta</SelectItem>
                                        <SelectItem value="janela">Próximo à Janela</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Atualizar Vaga" : "Criar Vaga"}
                </Button>
            </form>
        </Form>
    )
}
