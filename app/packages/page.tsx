import { createClient } from "@/lib/supabase-server";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UsersIcon, CheckIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AddPackageToCartButton } from "./add-package-button";

export const dynamic = 'force-dynamic';

async function getPacotes() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('pacote_quartos')
        .select(`
      *,
      pacotes (
        nome,
        descricao
      ),
      quartos (
        tipo_quarto,
        capacidade
      )
    `)
        .gte('data_fim', new Date().toISOString()) // Apenas pacotes futuros ou atuais
        .order('data_inicio', { ascending: true });

    if (error) {
        console.error("Erro ao buscar pacotes:", error);
        return [];
    }
    return data;
}

export default async function PackagesPage() {
    const pacotes = await getPacotes();

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Nossos Pacotes Especiais</h1>
            <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
                Aproveite nossas ofertas exclusivas para uma estadia inesquecível.
                Pacotes promocionais com descontos e benefícios especiais.
            </p>

            {pacotes.length === 0 ? (
                <div className="text-center py-20 bg-muted rounded-lg">
                    <h2 className="text-xl font-semibold">Nenhum pacote disponível no momento.</h2>
                    <p className="text-muted-foreground mt-2">Volte em breve para conferir nossas novidades!</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pacotes.map((pacote) => (
                        <Card key={pacote.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="mb-2">
                                        {pacote.quartos?.tipo_quarto.replace('_', ' ')}
                                    </Badge>
                                    {pacote.fechar_quarto && (
                                        <Badge variant="outline" className="border-primary text-primary">
                                            Quarto Inteiro
                                        </Badge>
                                    )}
                                </div>
                                <CardTitle className="text-xl">{pacote.pacotes?.nome}</CardTitle>
                                <CardDescription className="line-clamp-3">
                                    {pacote.pacotes?.descricao}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center text-muted-foreground">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        <span>
                                            {format(new Date(pacote.data_inicio), "dd/MM", { locale: ptBR })} até {format(new Date(pacote.data_fim), "dd/MM/yyyy", { locale: ptBR })}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <UsersIcon className="mr-2 h-4 w-4" />
                                        <span>Até {pacote.quartos?.capacidade} pessoas</span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t">
                                        <div className="flex items-baseline justify-between">
                                            <span className="text-sm text-muted-foreground">Total do Pacote</span>
                                            <span className="text-2xl font-bold text-primary">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pacote.preco_total_pacote)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <AddPackageToCartButton
                                    pacoteQuartoId={pacote.id}
                                    dataInicio={pacote.data_inicio}
                                    dataFim={pacote.data_fim}
                                />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
