import { create } from "zustand";
import axios from "axios";
import type { CartItem } from "../types";

export interface CartStore {
    cart: CartItem[];
    isLoading: boolean;
    error: string | null;
    loadCart: () => Promise<void>;
    addToCart: (itemId: string, quantity?: number) => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => {
    return {
        cart: [],
        isLoading: false,
        error: null,

        async loadCart() {
            set({ isLoading: true, error: null });
            try {
                const response = await axios.get<CartItem[]>('/api/cart-items?expand=product');
                set({ cart: response.data, isLoading: false });
            } catch (error) {
                console.log('Failed to load cart: ', error);
                set({ error: 'Failed to load cart', isLoading: false });
            }
        },

        async addToCart(itemId: string, quantity: number = 1) {
            await axios.post<void>("/api/cart-items", {
                productId: itemId,
                quantity: quantity,
            });

            await get().loadCart();
        }
    };
});