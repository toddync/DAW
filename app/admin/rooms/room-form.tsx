"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Quarto } from "@/lib/types"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

// Esquema de validação para o formulário de quarto
const formSchema = z.object({
  numero: z.string().min(1, "O número do quarto é obrigatório."),
  descricao: z.string().optional(),
  tipo_quarto: z.enum(["4_vagas", "8_vagas", "12_vagas"]),
  capacidade: z.coerce.number().int().positive("A capacidade deve ser um número positivo."),
  preco_base: z.coerce.number().positive("O preço deve ser um número positivo."),
  ativo: z.boolean().default(true),
  images: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()) : []),
})

type RoomFormValues = z.infer<typeof formSchema>

interface RoomFormProps {
  initialData?: Partial<Quarto>;
  onSubmit: (values: RoomFormValues) => void;
  isSubmitting: boolean;
}

export function RoomForm({ initialData, onSubmit, isSubmitting }: RoomFormProps) {
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      // Transforma o array de imagens em uma string para o input
      images: initialData?.images?.join(', ') || '',
    } || {},
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do Quarto</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 101, 202A" {...field} />
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
                <Textarea placeholder="Uma breve descrição do quarto." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="tipo_quarto"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="4_vagas">4 Vagas</SelectItem>
                        <SelectItem value="8_vagas">8 Vagas</SelectItem>
                        <SelectItem value="12_vagas">12 Vagas</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="capacidade"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Capacidade</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="Ex: 4" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="preco_base"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço Base (por noite)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="Ex: 120.50" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagens</FormLabel>
              <FormControl>
                <Input placeholder="URL da imagem 1, URL da imagem 2, ..." {...field} />
              </FormControl>
              <FormDescription>
                Insira as URLs das imagens separadas por vírgula.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Ativo</FormLabel>
                <FormDescription>
                  Se desativado, o quarto não aparecerá nas buscas.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData?.id ? 'Salvar Alterações' : 'Criar Quarto'}
        </Button>
      </form>
    </Form>
  )
}
