import type { OrderProduct } from "./OrderProduct";

export interface Order {
    id: string;
    orderTimeMs: number;
    totalCostCents: number;
    products: OrderProduct[];
    createdAt?: string;
    updatedAt?: string;
}