// app/account/profile-form.tsx
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Loader2 } from "lucide-react"
import { Usuario } from "@/lib/types"

// Schema de validação com Zod
const profileFormSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  telefone: z.string().optional(),
  nacionalidade: z.string().min(2, { message: "Selecione sua nacionalidade." }),
  documento_tipo: z.enum(["cpf", "passaporte"]),
  cpf: z.string().optional(),
  passaporte: z.string().optional(),
}).refine(data => {
  if (data.documento_tipo === 'cpf') {
    return !!data.cpf && data.cpf.length > 10; // Validação simples de CPF
  }
  if (data.documento_tipo === 'passaporte') {
    return !!data.passaporte && data.passaporte.length > 5; // Validação simples de passaporte
  }
  return false;
}, {
  message: "O documento informado é inválido.",
  path: ["cpf"], // O erro aparecerá em um campo genérico ou no primeiro
});

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
  onSuccess?: () => void;
}

export function ProfileForm({ onSuccess }: ProfileFormProps) {
  const { toast } = useToast()
  const supabase = getSupabaseClient()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      nacionalidade: "Brasil",
      documento_tipo: "cpf",
      cpf: "",
      passaporte: "",
    },
  })

  const nacionalidade = form.watch("nacionalidade");

  useEffect(() => {
    if (nacionalidade !== "Brasil") {
      form.setValue("documento_tipo", "passaporte");
    } else {
      form.setValue("documento_tipo", "cpf");
    }
  }, [nacionalidade, form]);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .single<Usuario>();

        if (profile) {
          form.reset({
            nome: profile.nome || "",
            telefone: profile.telefone || "",
            nacionalidade: profile.nacionalidade || "Brasil",
            documento_tipo: profile.passaporte ? "passaporte" : "cpf",
            cpf: profile.cpf || "",
            passaporte: profile.passaporte || "",
          });
        }
      }
      setLoading(false);
    }
    fetchProfile();
  }, [form, supabase]);

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado.");

      const { error } = await supabase
        .from('usuarios')
        .update({
          nome: data.nome,
          telefone: data.telefone,
          nacionalidade: data.nacionalidade,
          cpf: data.documento_tipo === 'cpf' ? data.cpf : null,
          passaporte: data.documento_tipo === 'passaporte' ? data.passaporte : null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Perfil Atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar seu perfil.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="(XX) XXXXX-XXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nacionalidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nacionalidade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua nacionalidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Brasil">Brasil</SelectItem>
                  <SelectItem value="Outra">Outra</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {nacionalidade === 'Brasil' ? (
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input placeholder="000.000.000-00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="passaporte"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do Passaporte</FormLabel>
                <FormControl>
                  <Input placeholder="Número do seu passaporte" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar Alterações
        </Button>
      </form>
    </Form>
  )
}
