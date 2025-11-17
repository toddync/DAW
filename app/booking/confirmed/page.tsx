'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// A interface pode ser mais detalhada com base no retorno real da API
interface ConfirmedReservation {
    codigo_reserva: string;
    data_checkin: string;
    data_checkout: string;
    valor_total: number;
    reserva_vagas: {
        vaga: {
            numero_vaga: number;
            quarto: {
                numero: string;
            };
        };
    }[];
}

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reservaId = searchParams.get('id');

    const [reserva, setReserva] = useState<ConfirmedReservation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!reservaId) {
            router.push('/');
            return;
        }

        async function fetchReserva() {
            try {
                setLoading(true);
                const response = await fetch(`/api/reservations/${reservaId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.details || 'Falha ao carregar os detalhes da reserva.');
                }
                const data = await response.json();
                setReserva(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ocorreu um erro.');
            } finally {
                setLoading(false);
            }
        }

        fetchReserva();
    }, [reservaId, router]);

    if (loading) {
        return <div className="flex justify-center items-center p-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (error) {
        return (
            <div className="text-center text-destructive">
                <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                <p>{error}</p>
            </div>
        );
    }

    if (!reserva) {
        return <p className="text-center text-muted-foreground">Reserva não encontrada.</p>;
    }

    return (
        <>
            <CardHeader className="items-center text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <CardTitle className="text-3xl">Reserva Confirmada!</CardTitle>
                <CardDescription>Obrigado por escolher o Hostel Santa Teresa. Sua reserva está garantida.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Código da Reserva:</span>
                        <span className="font-mono font-bold">{reserva.codigo_reserva}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Check-in:</span>
                        <span className="font-medium">{reserva.data_checkin}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Check-out:</span>
                        <span className="font-medium">{reserva.data_checkout}</span>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Detalhes</h4>
                    {reserva.reserva_vagas.map((rv, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                            - Quarto Nº {rv.vaga.quarto.numero}, Vaga {rv.vaga.numero_vaga}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center text-xl font-bold pt-4 border-t">
                    <p>Total Pago</p>
                    <p>R$ {reserva.valor_total.toFixed(2)}</p>
                </div>
            </CardContent>
        </>
    );
}


export default function BookingConfirmedPage() {
    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <Card>
                <Suspense fallback={<div className="flex justify-center items-center p-10"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                    <ConfirmationContent />
                </Suspense>
                <div className="p-6 border-t">
                    <Button asChild className="w-full">
                        <Link href="/reservations">Ver Todas as Minhas Reservas</Link>
                    </Button>
                </div>
            </Card>
        </div>
    );
}
