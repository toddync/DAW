// app/reservations/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase-client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, BedDouble, Calendar, Home, Loader2, Star, Package } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

// Tipos
interface ReservaDetalhada {
  id: string;
  data_checkin: string;
  data_checkout: string;
  valor_total: number;
  status: string;
  avaliacoes: { id: string }[];
  reserva_vagas: {
    pacote_quarto_id?: string;
    vaga: {
      id: string;
      numero_vaga: number;
      tipo_cama: string;
      quarto: {
        id: string;
        numero: string;
        descricao: string | null;
        images: string[] | null;
      };
    };
    pacote_quarto?: {
      id: string;
      pacote: {
        nome: string;
        descricao?: string | null;
      };
    };
  }[];
}

// Componente do Dialog de Avaliação
function ReviewDialog({ reservaId, onReviewSubmit }: { reservaId: string, onReviewSubmit: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reserva_id: reservaId, nota: rating, comentario: comment }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Falha ao enviar avaliação.');
      }
      toast({ title: "Avaliação enviada", description: "Obrigado pelo seu feedback!" });
      onReviewSubmit(); // Callback para fechar o dialog e atualizar a UI
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: error instanceof Error ? error.message : 'Ocorreu um erro.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Avalie sua Estadia</DialogTitle>
        <DialogDescription>Seu feedback nos ajuda a melhorar.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Nota</Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`cursor-pointer h-7 w-7 ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="comment">Comentário (opcional)</Label>
          <Textarea
            id="comment"
            placeholder="Descreva sua experiência..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild><Button variant="ghost">Fechar</Button></DialogClose>
        <Button onClick={handleSubmit} disabled={rating === 0 || isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enviar Avaliação
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}


export default function ReservationsPage() {
  const [reservas, setReservas] = useState<ReservaDetalhada[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
  const router = useRouter()
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  async function fetchReservations() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login?redirect=/reservations');
      return;
    }
    try {
      // Não seta loading como true aqui para um refresh mais suave
      const response = await fetch('/api/reservations');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Falha ao buscar reservas');
      }
      const data = await response.json();
      setReservas(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchReservations();
  }, [supabase, router]);

  const handleCancel = async (reservaId: string) => {
    setIsCancelling(reservaId);
    try {
      const response = await fetch(`/api/reservations/${reservaId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Não foi possível cancelar a reserva.');
      }
      toast({ title: "Sucesso", description: "Sua reserva foi cancelada." });
      await fetchReservations(); // Re-fetch para atualizar a lista
    } catch (err) {
      toast({ variant: "destructive", title: "Erro no Cancelamento", description: err instanceof Error ? err.message : 'Ocorreu um erro.' });
    } finally {
      setIsCancelling(null);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const activeReservations = reservas.filter(r => r.data_checkout >= today && r.status !== 'cancelada' && r.status !== 'checkout');
  const pastReservations = reservas.filter(r => r.data_checkout < today || r.status === 'cancelada' || r.status === 'checkout');

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-10 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-16 bg-card z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Suas Reservas</h1>
          <p className="text-muted-foreground mt-2">Visualize suas reservas ativas e passadas.</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-destructive">{error}</div>
          </div>
        )}

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Reservas Ativas</h2>
          {activeReservations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeReservations.map((res) => {
                const firstItem = res.reserva_vagas[0];
                const isPackage = !!firstItem.pacote_quarto_id;
                const pacote = firstItem.pacote_quarto?.pacote;
                const quarto = firstItem.vaga.quarto;

                const isCancellable = res.status === 'confirmada' || res.status === 'pendente';

                return (
                  <Card key={res.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {isPackage ? (
                          <>
                            <Package className="w-5 h-5 text-primary" />
                            {pacote?.nome || 'Pacote'}
                          </>
                        ) : (
                          <>
                            <Home className="w-5 h-5 text-primary" />
                            Quarto Nº {quarto.numero}
                          </>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 flex-grow">
                      {isPackage && pacote?.descricao && (
                        <p className="text-sm text-muted-foreground">{pacote.descricao}</p>
                      )}

                      <div className="flex items-center gap-2 text-sm">
                        <Home className="w-4 h-4 text-muted-foreground" />
                        <span>Quarto Nº {quarto.numero}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <BedDouble className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {isPackage
                            ? `${res.reserva_vagas.length} vaga(s) reservada(s)`
                            : `Vaga ${firstItem.vaga.numero_vaga} (${firstItem.vaga.tipo_cama})`
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{res.data_checkin} a {res.data_checkout}</span>
                      </div>
                      <Badge>{res.status}</Badge>
                    </CardContent>
                    {isCancellable && (
                      <CardFooter>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full" disabled={isCancelling === res.id}>
                              {isCancelling === res.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Cancelar Reserva
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
                                Verifique a política de cancelamento para possíveis multas.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Voltar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleCancel(res.id)}>
                                Sim, cancelar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">Você não possui reservas ativas.</p>
          )}
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Reservas Passadas</h2>
          {pastReservations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastReservations.map((res) => {
                const firstItem = res.reserva_vagas[0];
                const isPackage = !!firstItem.pacote_quarto_id;
                const pacote = firstItem.pacote_quarto?.pacote;
                const quarto = firstItem.vaga.quarto;

                const canReview = res.status === 'checkout' && res.avaliacoes.length === 0;

                return (
                  <Dialog key={res.id}>
                    <Card className="opacity-70 flex flex-col">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {isPackage ? (
                            <>
                              <Package className="w-5 h-5" />
                              {pacote?.nome || 'Pacote'}
                            </>
                          ) : (
                            <>
                              <Home className="w-5 h-5" />
                              Quarto Nº {quarto.numero}
                            </>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 flex-grow">
                        <div className="flex items-center gap-2 text-sm">
                          <Home className="w-4 h-4 text-muted-foreground" />
                          <span>Quarto Nº {quarto.numero}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <BedDouble className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {isPackage
                              ? `${res.reserva_vagas.length} vaga(s)`
                              : `Vaga ${firstItem.vaga.numero_vaga}`
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{res.data_checkin} a {res.data_checkout}</span>
                        </div>
                        <Badge variant="outline">{res.status}</Badge>
                      </CardContent>
                      {canReview && (
                        <CardFooter>
                          <DialogTrigger asChild>
                            <Button variant="secondary" className="w-full">Avaliar Estadia</Button>
                          </DialogTrigger>
                        </CardFooter>
                      )}
                    </Card>
                    <ReviewDialog reservaId={res.id} onReviewSubmit={fetchReservations} />
                  </Dialog>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">Você não possui reservas passadas.</p>
          )}
        </section>
      </main>
    </div>
  )
}
