'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useBookingStore } from '@/lib/store';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ShoppingCart } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase-client';

interface AddPackageToCartButtonProps {
  pacoteQuartoId: string;
  dataInicio: string;
  dataFim: string;
  disabled?: boolean;
}

export function AddPackageToCartButton({
  pacoteQuartoId,
  dataInicio,
  dataFim,
  disabled = false
}: AddPackageToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addPackageToCart } = useBookingStore();
  const { toast } = useToast();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const handleAddToCart = async () => {
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: 'Login Necessário',
        description: 'Faça login para adicionar pacotes ao carrinho.',
        variant: 'destructive',
      });
      router.push(`/login?redirect=/packages`);
      return;
    }

    setIsAdding(true);
    try {
      await addPackageToCart(pacoteQuartoId, {
        start: dataInicio,
        end: dataFim
      });

      toast({
        title: 'Pacote Adicionado!',
        description: 'O pacote foi adicionado ao seu carrinho.',
      });

      // Redirect to cart/checkout
      router.push('/checkout');
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível adicionar o pacote ao carrinho.',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      className="w-full"
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
    >
      {isAdding ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adicionando...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Adicionar ao Carrinho
        </>
      )}
    </Button>
  );
}
