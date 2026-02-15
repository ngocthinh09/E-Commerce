import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { DeliveryOptionService } from '../delivery-option/delivery-option.service';
import { CartItemService } from '../cart-item/cart-item.service';

export interface PaymentSummary {
  totalItems: number;
  productCostCents: number;
  shippingCostCents: number;
  totalCostBeforeTaxCents: number;
  taxCents: number;
  totalCostCents: number;
}

@Injectable()
export class PaymentSummaryService {
  constructor(
    private readonly productService: ProductService,
    private readonly delOptService: DeliveryOptionService,
    private readonly cartItemService: CartItemService,
  ) {}

  async getPaymentSummary(): Promise<PaymentSummary> {
    const cartItems = await this.cartItemService.findAll();
    let totalItems = 0;
    let productCostCents = 0;
    let shippingCostCents = 0;

    for (const item of cartItems) {
      const product = await this.productService.findOne(item.productId);
      const delOpt = await this.delOptService.findOne(item.deliveryOptionId);
      totalItems += item.quantity;
      productCostCents +=
        (product?.priceCents ? product.priceCents : 0) * item.quantity;
      shippingCostCents += delOpt?.priceCents ? delOpt.priceCents : 0;
    }

    const totalCostBeforeTaxCents = productCostCents + shippingCostCents;
    const taxCents = Math.round(totalCostBeforeTaxCents * 0.1);
    const totalCostCents = totalCostBeforeTaxCents + taxCents;

    return {
      totalItems,
      productCostCents,
      shippingCostCents,
      totalCostBeforeTaxCents,
      taxCents,
      totalCostCents,
    };
  }
}
