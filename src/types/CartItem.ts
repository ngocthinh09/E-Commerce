import type { Product } from "./Product";

export interface CartItem {
    id: number;
    productId: string;
    quantity: number;
    deliveryOptionId: string;
    product?: Product;
    createdAt?: string;
    updatedAt?: string;
}