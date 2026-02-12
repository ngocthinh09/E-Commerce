export interface DeliveryOption {
    id: string;
    deliveryDays: number;
    priceCents: number;
    estimatedDeliveryTimeMs?: number;
    createdAt?: string;
    updatedAt?: string;
}