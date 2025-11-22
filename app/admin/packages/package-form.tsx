// app/admin/packages/package-form.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Pacote, PacoteQuarto, Quarto } from "@/lib/types"
import { useEffect, useState } from "react"

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale" // Importar o locale ptBR
import { cn } from "@/lib/utils"

// Esquema de validação para o formulário de pacote_quartos
const formSchema = z.object({
  pacote_id: z.string().min(1, "Selecione um pacote."),
  quarto_id: z.string().min(1, "Selecione um quarto."),
  data_inicio: z.date({ required_error: "Data de início é obrigatória." }),
  data_fim: z.date({ required_error: "Data de fim é obrigatória." }),
  preco_total_pacote: z.coerce.number().positive("O preço total deve ser um número positivo."),
  fechar_quarto: z.boolean().default(false),
}).refine((data) => data.data_inicio < data.data_fim, {
  message: "A data de fim deve ser posterior à data de início.",
  path: ["data_fim"],
});

type PackageFormValues = z.infer<typeof formSchema>

interface PackageFormProps {
  initialData?: Partial<PacoteQuarto>;
  onSubmit: (values: PackageFormValues) => void;
  isSubmitting: boolean;
}

export function PackageForm({ initialData, onSubmit, isSubmitting }: PackageFormProps) {
  const [pacotesTemplates, setPacotesTemplates] = useState<Pacote[]>([]);
  const [quartos, setQuartos] = useState<Quarto[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      data_inicio: initialData?.data_inicio ? new Date(initialData.data_inicio) : undefined,
      data_fim: initialData?.data_fim ? new Date(initialData.data_fim) : undefined,
      preco_total_pacote: initialData?.preco_total_pacote || 0,
      fechar_quarto: initialData?.fechar_quarto || false,
    },
  });

  useEffect(() => {
    async function fetchData() {
      setLoadingData(true);
      try {
        const [pacotesRes, quartosRes] = await Promise.all([
          fetch("/api/admin/packages/templates"), // Nova API para templates de pacotes
          fetch("/api/admin/quartos?limit=100") // API existente para quartos, aumentando o limite para trazer todos
        ]);

        if (!pacotesRes.ok) throw new Error("Falha ao carregar templates de pacotes.");
        if (!quartosRes.ok) throw new Error("Falha ao carregar quartos.");

        const pacotesData: Pacote[] = await pacotesRes.json();
        const quartosResponse = await quartosRes.json();
        // A API de quartos retorna um objeto paginado { data: [], ... }
        const quartosData: Quarto[] = quartosResponse.data || [];

        setPacotesTemplates(pacotesData);
        setQuartos(quartosData);
      } catch (error) {
        console.error("Erro ao carregar dados para o formulário de pacote:", error);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  if (loadingData) {
    return <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="pacote_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pacote (Template)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um pacote" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pacotesTemplates.map((pacote) => (
                    <SelectItem key={pacote.id} value={pacote.id}>
                      {pacote.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
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
                      Quarto Nº {quarto.numero} ({quarto.tipo_quarto})
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
            name="data_inicio"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Início</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={ptBR} // Definir o locale para o calendário
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="data_fim"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Fim</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < (form.watch("data_inicio") || new Date()) || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={ptBR} // Definir o locale para o calendário
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="preco_total_pacote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço Total do Pacote</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="Ex: 300,00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fechar_quarto"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Fechar Quarto</FormLabel>
                <FormDescription>
                  Se ativado, o quarto inteiro será considerado reservado por este pacote no período.
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
          {initialData?.id ? 'Salvar Alterações' : 'Criar Pacote de Quarto'}
        </Button>
      </form>
    </Form>
  )
}
