'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { AlertCircle, ArrowLeft, Bed, Calendar, Home, MapPin, User, Wifi } from 'lucide-react'

import { QuartoComVagas, Vaga } from '@/lib/types'
import { useBookingStore } from '@/lib/store'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

const vagaTipoLabels: Record<string, string> = {
  solteiro: 'Cama de Solteiro',
  superior: 'Beliche Superior',
  inferior: 'Beliche Inferior',
}

const vagaPosicaoLabels: Record<string, string> = {
  porta: 'Próximo à Porta',
  centro: 'Centro',
  janela: 'Próximo à Janela',
}

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  
  const [quarto, setQuarto] = useState<QuartoComVagas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { dateRange, addCartItem, cart } = useBookingStore();
  const { toast } = useToast();

  const isVagaInCart = (vagaId: string) => {
    return cart.some(
      (item) =>
        item.vaga.id === vagaId &&
        item.data_inicio === dateRange.start &&
        item.data_fim === dateRange.end
    );
  };

  useEffect(() => {
    async function fetchQuarto() {
      if (!roomId) return;
      try {
        setLoading(true);
        const url = `/api/rooms/${roomId}?start=${dateRange.start || ''}&end=${dateRange.end || ''}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Falha ao buscar dados do quarto');
        }
        
        const data: QuartoComVagas = await response.json();
        setQuarto(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchQuarto();
  }, [roomId, dateRange]);

  const handleAddToCart = async (vaga: Vaga) => {
    if (!quarto || !dateRange.start || !dateRange.end) {
      toast({
        variant: "destructive",
        title: "Período não selecionado",
        description: "Por favor, selecione um período de estadia na página de busca.",
      });
      return;
    }
    try {
      await addCartItem(quarto, vaga, dateRange);
      toast({
        title: "Item Adicionado ao Carrinho",
        description: `A vaga ${vaga.numero_vaga} no Quarto Nº ${quarto.numero} foi adicionada.`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Não foi possível adicionar o item ao carrinho.";
      if (errorMessage === "Faça login para adicionar itens ao carrinho.") {
        router.push(`/login?redirect=/rooms/${roomId}`);
        toast({
          variant: "destructive",
          title: "Login Necessário",
          description: "Por favor, faça login para adicionar itens ao carrinho.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: errorMessage,
        });
      }
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8"><Skeleton className="h-96 w-full" /></div>;
  }

  if (error || !quarto) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-destructive">Erro ao Carregar Quarto</h2>
        <p className="text-muted-foreground mt-2">{error || "O quarto que você está procurando não foi encontrado."}</p>
        <Button onClick={() => router.push('/booking')} className="mt-6">Voltar para a busca</Button>
      </div>
    );
  }

  const precoPorVaga = quarto.preco_base / quarto.capacidade;

  return (
    <div className="min-h-screen bg-background">
      <header className="py-4">
        <div className="max-w-4xl mx-auto px-4">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a lista de quartos
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-12 space-y-8">
        <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden bg-muted">
          <Image
            src={quarto.images?.[0] || "/placeholder.svg"}
            alt={`Foto do Quarto Nº ${quarto.numero}`}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-foreground">Quarto Nº {quarto.numero}</h1>
          <p className="text-lg text-muted-foreground mt-2">{quarto.descricao}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Comodidades do Quarto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {quarto.caracteristicas.map(({ caracteristica }) => (
                <Badge key={caracteristica.codigo} variant="secondary" className="text-sm py-1 px-3">
                  {/* Idealmente, teríamos um mapeamento de ícones aqui */}
                  {caracteristica.nome}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Vagas Disponíveis</h2>
          {!dateRange.start || !dateRange.end && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Selecione um período na página de busca para ver a disponibilidade e adicionar ao carrinho.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quarto.vagas.map((vaga) => (
              <Card key={vaga.id} className={`transition-all ${!vaga.available ? 'bg-muted/50 opacity-60' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-4">
                    <span className="text-lg">Vaga {vaga.numero_vaga}</span>
                    {vaga.available ? 
                      <Badge variant="default" className="bg-green-600">Disponível</Badge> : 
                      <Badge variant="destructive">Indisponível</Badge>
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><Bed className="w-4 h-4" /> {vagaTipoLabels[vaga.tipo_cama] || vaga.tipo_cama}</p>
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {vagaPosicaoLabels[vaga.posicao] || vaga.posicao}</p>
                  </div>
                  
                  <Separator />

                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground text-lg">
                      R$ {precoPorVaga.toFixed(2)}
                      <span className="text-xs font-normal text-muted-foreground"> / noite</span>
                    </p>
                    <Button
                      onClick={() => handleAddToCart(vaga)}
                      disabled={!vaga.available || !dateRange.start || !dateRange.end || isVagaInCart(vaga.id)}
                      size="sm"
                    >
                      {isVagaInCart(vaga.id) ? 'No Carrinho' : 'Adicionar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
