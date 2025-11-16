import { create } from 'zustand';
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
  vaga: Vaga & { quarto: Quarto };
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
  removeCartItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearCartFromStore: () => void; // Adicionada a assinatura da função
}

export const useBookingStore = create<BookingState>((set, get) => ({
  dateRange: { start: null, end: null },
  setDateRange: (start, end) => {
    // Otimização: não atualiza o estado se o período for o mesmo
    if (get().dateRange.start === start && get().dateRange.end === end) {
      return;
    }
    set({ dateRange: { start, end } });
  },
  
  filters: {
    bedTypes: new Set(),
    amenities: new Set(),
  },
  toggleBedType: (type) =>
    set((state) => {
      const newBedTypes = new Set(state.filters.bedTypes);
      newBedTypes.has(type) ? newBedTypes.delete(type) : newBedTypes.add(type);
      return { filters: { ...state.filters, bedTypes: newBedTypes } };
    }),
  toggleAmenity: (amenity) =>
    set((state) => {
      const newAmenities = new Set(state.filters.amenities);
      newAmenities.has(amenity) ? newAmenities.delete(amenity) : newAmenities.add(amenity);
      return { filters: { ...state.filters, amenities: newAmenities } };
    }),
  clearFilters: () => set({ filters: { bedTypes: new Set(), amenities: new Set() } }),
  
  cart: [],
  fetchCart: async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Falha ao buscar o carrinho');
      const cart = await response.json();
      set({ cart });
    } catch (error) {
      console.error("fetchCart error:", error);
      // Opcional: adicionar estado de erro ao store
    }
  },
  
  addCartItem: async (quarto, vaga, dateRange) => {
    if (!dateRange.start || !dateRange.end) {
      console.error("Período de datas inválido para adicionar ao carrinho.");
      return; // Prevenção de erro
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
        const errorData = await response.json();
        throw new Error(errorData.details || 'Falha ao adicionar item ao carrinho');
      }
      // Atualiza o carrinho após a adição bem-sucedida
      await get().fetchCart();
    } catch (error) {
      console.error("addCartItem error:", error);
      throw error; // Re-lança para que a UI possa tratar
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
      // Otimização: remove o item localmente para uma UI mais rápida
      set(state => ({
        cart: state.cart.filter(item => item.id !== itemId)
      }));
    } catch (error) {
      console.error("removeCartItem error:", error);
      // Se a remoção local falhar, busca novamente do servidor para garantir consistência
      await get().fetchCart();
    }
  },

  clearCart: async () => {
    const { cart } = get();
    // Executa todas as remoções em paralelo para otimização
    await Promise.all(cart.map(item => get().removeCartItem(item.id)));
  },

  // Implementação da função que faltava
  clearCartFromStore: () => set({ cart: [] }),
}));
