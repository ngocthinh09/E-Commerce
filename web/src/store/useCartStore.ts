import { create } from "zustand";
import axiosClient from "../api/axiosClient";
import type { CartItem } from "../types";

export interface CartStore {
    cart: CartItem[];
    isLoading: boolean;
    error: string | null;
    loadCart: () => Promise<void>;
    addItem: (itemId: string, quantity?: number) => Promise<void>;
    updateItem: (itemId: string, updateData: {quantity?: number; deliveryOptionId?: string;}) => Promise<void>;
    deleteItem: (itemId: string) => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => {
    return {
        cart: [],
        isLoading: false,
        error: null,

        async loadCart() {
            set({ isLoading: true, error: null });
            try {
                const response = await axiosClient.get<CartItem[]>('/api/cart-items?expand=product');
                set({ cart: response.data, isLoading: false });
            } catch (error) {
                console.log('Failed to load cart: ', error);
                set({ error: 'Failed to load cart', isLoading: false });
            }
        },

        async addItem(itemId: string, quantity: number = 1) {
            await axiosClient.post<void>("/api/cart-items", {
                productId: itemId,
                quantity: quantity,
            });

            await get().loadCart();
        },

        async updateItem(itemId: string, updateData: {quantity?: number; deliveryOptionId?: string;}) {
            await axiosClient.put<void>(`/api/cart-items/${itemId}`, updateData);
            await get().loadCart();
        },

        async deleteItem(itemId: string) {
            await axiosClient.delete<void>(`/api/cart-items/${itemId}`);
            await get().loadCart();
        }
    };
});