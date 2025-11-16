'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore, CartItem } from '@/lib/store';
import { getSupabaseClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

// Função para calcular a diferença de dias
const calculateDays = (start: string, end: string) => {
  const date1 = new Date(start);
  const date2 = new Date(end);
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = getSupabaseClient();
  
  const { cart, fetchCart, clearCart } = useBookingStore();
  const [termos, setTermos] = useState({ texto: '', versao: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeCheckout() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/checkout');
        return;
      }

      try {
        setLoading(true);
        await fetchCart();
        
        const termsResponse = await fetch('/api/terms');
        if (termsResponse.ok) {
          const termsData = await termsResponse.json();
          setTermos(termsData);
        } else {
          throw new Error('Não foi possível carregar os Termos de Uso.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro ao carregar a página.');
      } finally {
        setLoading(false);
      }
    }
    initializeCheckout();
  }, [supabase, router, fetchCart]);

  const total = cart.reduce((acc, item) => {
    const nights = calculateDays(item.data_inicio, item.data_fim);
    const pricePerNight = item.vaga.quarto.preco_base / item.vaga.quarto.capacidade;
    return acc + (pricePerNight * nights);
  }, 0);

  const handleBooking = async () => {
    setIsBooking(true);
    try {
      const payload = {
        vagas: cart.map(item => ({
          vaga_id: item.vaga.id,
          data_inicio: item.data_inicio,
          data_fim: item.data_fim,
          preco: (item.vaga.quarto.preco_base / item.vaga.quarto.capacidade) * calculateDays(item.data_inicio, item.data_fim),
        })),
        valorTotal: total,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Falha ao criar a reserva.');
      }

      const result = await response.json();
      
      toast({
        title: 'Reserva Confirmada!',
        description: 'Sua reserva foi criada com sucesso.',
      });

      await clearCart(); // Limpa o carrinho na API
      router.push(`/booking/confirmed?id=${result.reserva_id}`);

    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro na Reserva',
        description: err instanceof Error ? err.message : 'Não foi possível completar sua reserva.',
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error) {
    return <div className="text-center py-10 text-destructive">{error}</div>;
  }
  
  if (cart.length === 0 && !loading) {
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
            <p className="text-muted-foreground mb-6">Adicione algumas vagas antes de prosseguir para o checkout.</p>
            <Button asChild>
                <Link href="/booking">Buscar Quartos</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Checkout</CardTitle>
          <CardDescription>Revise seu pedido e confirme a reserva.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Itens da Reserva</h3>
            {cart.map(item => {
              const nights = calculateDays(item.data_inicio, item.data_fim);
              const pricePerNight = item.vaga.quarto.preco_base / item.vaga.quarto.capacidade;
              const itemTotal = pricePerNight * nights;

              return (
                <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Quarto Nº {item.vaga.quarto.numero} - Vaga {item.vaga.numero_vaga}</p>
                    <p className="text-sm text-muted-foreground">{item.data_inicio} a {item.data_fim} ({nights} noites)</p>
                  </div>
                  <p className="font-semibold">R$ {itemTotal.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
          <Separator />
          <div className="flex justify-between items-center text-xl font-bold">
            <p>Total</p>
            <p>R$ {total.toFixed(2)}</p>
          </div>
          <Separator />
          <div className="space-y-4">
            <h3 className="font-semibold">Termos de Uso (Versão {termos.versao})</h3>
            <div className="h-40 overflow-y-auto p-3 border rounded-md text-sm text-muted-foreground bg-muted/50">
              <p style={{ whiteSpace: 'pre-wrap' }}>{termos.texto || 'Carregando termos...'}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)} />
              <Label htmlFor="terms" className="cursor-pointer">Eu li e aceito os termos de uso.</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleBooking} 
            disabled={!acceptedTerms || isBooking}
          >
            {isBooking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isBooking ? 'Confirmando...' : 'Confirmar e Pagar'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
