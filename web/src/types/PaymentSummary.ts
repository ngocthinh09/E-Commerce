export interface PaymentSummary {
    totalItems: number;
    productCostCents: number;
    shippingCostCents: number;
    totalCostBeforeTaxCents: number;
    taxCents: number;
    totalCostCents: number;
}