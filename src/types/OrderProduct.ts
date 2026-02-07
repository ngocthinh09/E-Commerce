import type { Product } from "./Product";

export interface OrderProduct {
    productId: string;
    quantity: number;
    estimatedDeliveryTimeMs: number;
    product: Product;   
}