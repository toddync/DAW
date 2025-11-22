import { create } from 'zustand';
import { getSupabaseClient } from '@/lib/supabase-client';
import { Quarto, Vaga } from './types';

// Tipos para o store
interface DateRange {
  start: string | null;
  end: string | null;
}

export interface CartItem {
  id: string; // ID do item no carrinho (carrinho_itens.id)
  data_inicio: string;
  data_fim: string;
  tipo: 'individual' | 'pacote';
  vaga: Vaga & { quarto: Quarto };
  pacote_quarto_id?: string; // ID do pacote se tipo === 'pacote'
  preco_fixo?: number; // Preço fixo do pacote
}

interface FilterState {
  bedTypes: Set<string>;
  amenities: Set<string>;
}

interface BookingState {
  dateRange: DateRange;
  setDateRange: (start: string | null, end: string | null) => void;
  filters: FilterState;
  toggleBedType: (type: string) => void;
  toggleAmenity: (amenity: string) => void;
  clearFilters: () => void;
  cart: CartItem[];
  fetchCart: () => Promise<void>;
  addCartItem: (quarto: Quarto, vaga: Vaga, dateRange: DateRange) => Promise<void>;
  addPackageToCart: (pacoteQuartoId: string, dateRange: DateRange) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearCartFromStore: () => void;
  selectedPackageId: string | null;
  setSelectedPackageId: (id: string | null) => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  dateRange: { start: null, end: null },
  setDateRange: (start, end) => set({ dateRange: { start, end } }),
  selectedPackageId: null,
  setSelectedPackageId: (id) => set({ selectedPackageId: id }),
  filters: {
    bedTypes: new Set(),
    amenities: new Set(),
  },
  toggleBedType: (type) =>
    set((state) => {
      const newBedTypes = new Set(state.filters.bedTypes);
      if (newBedTypes.has(type)) {
        newBedTypes.delete(type);
      } else {
        newBedTypes.add(type);
      }
      return { filters: { ...state.filters, bedTypes: newBedTypes } };
    }),
  toggleAmenity: (amenity) =>
    set((state) => {
      const newAmenities = new Set(state.filters.amenities);
      if (newAmenities.has(amenity)) {
        newAmenities.delete(amenity);
      } else {
        newAmenities.add(amenity);
      }
      return { filters: { ...state.filters, amenities: newAmenities } };
    }),
  clearFilters: () =>
    set((state) => ({
      filters: { ...state.filters, bedTypes: new Set(), amenities: new Set() },
    })),
  cart: [],
  fetchCart: async () => {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      set({ cart: [] });
      return;
    }

    try {
      const response = await fetch('/api/cart');
      if (!response.ok) {
        throw new Error('Falha ao buscar o carrinho');
      }
      const cart = await response.json();
      set({ cart });
    } catch (error) {
      console.error("fetchCart error:", error);
      set({ cart: [] });
    }
  },
  addCartItem: async (quarto, vaga, dateRange) => {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error("Usuário não autenticado. Não é possível adicionar ao carrinho.");
      // Lançar um erro aqui é uma opção para a UI poder reagir,
      // por exemplo, redirecionando para o login.
      throw new Error("Faça login para adicionar itens ao carrinho.");
    }

    if (!dateRange.start || !dateRange.end) {
      console.error("Período de datas inválido para adicionar ao carrinho.");
      // Considerar lançar um erro aqui também para feedback na UI
      throw new Error("Selecione um período de datas válido.");
    }
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vaga_id: vaga.id,
          data_inicio: dateRange.start,
          data_fim: dateRange.end,
        }),
      });
      if (!response.ok) {
        let errorMessage = 'Falha ao adicionar item ao carrinho';
        try {
          const errorData = await response.json();
          // A API retorna 'Unauthorized' no campo 'error'
          errorMessage = errorData?.error || errorData?.details || errorMessage;
        } catch (parseErr) {
          console.error('Não foi possível parsear o corpo de erro da resposta:', parseErr);
        }
        console.error('addCartItem failed', { status: response.status, message: errorMessage });
        throw new Error(errorMessage);
      }
      await get().fetchCart();
    } catch (error) {
      console.error("addCartItem error:", error);
      throw error;
    }
  },
  addPackageToCart: async (pacoteQuartoId: string, dateRange: DateRange) => {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Faça login para adicionar pacotes ao carrinho.");
    }

    if (!dateRange.start || !dateRange.end) {
      throw new Error("Selecione um período de datas válido.");
    }

    try {
      const response = await fetch('/api/cart/package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pacote_quarto_id: pacoteQuartoId,
          data_inicio: dateRange.start,
          data_fim: dateRange.end,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Falha ao adicionar pacote ao carrinho';
        try {
          const errorData = await response.json();
          errorMessage = errorData?.error || errorData?.details || errorMessage;
        } catch (parseErr) {
          console.error('Não foi possível parsear o corpo de erro da resposta:', parseErr);
        }
        throw new Error(errorMessage);
      }

      await get().fetchCart();
    } catch (error) {
      // Erro já tratado ou repassado para o componente
      throw error;
    }
  },
  removeCartItem: async (itemId) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      if (!response.ok) throw new Error('Falha ao remover item do carrinho');
      set(state => ({
        cart: state.cart.filter(item => item.id !== itemId)
      }));
    } catch (error) {
      console.error("removeCartItem error:", error);
      await get().fetchCart();
    }
  },
  clearCart: async () => {
    const { cart } = get();
    await Promise.all(cart.map(item => get().removeCartItem(item.id)));
  },
  clearCartFromStore: () => set({ cart: [] }),
}));
