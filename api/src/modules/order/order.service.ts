import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { CartItemService } from '../cart-item/cart-item.service';
import { ProductService } from '../product/product.service';
import { DeliveryOptionService } from '../delivery-option/delivery-option.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductService,
    private readonly delOptService: DeliveryOptionService,
  ) {}

  findAll(userId: string) {
    return this.orderRepository.find({
      where: { userId },
      order: { orderTimeMs: 'DESC' },
    });
  }

  // id -> orderId
  findOne(userId: string, id: string) {
    return this.orderRepository.findOne({
      where: { id, userId },
    });
  }

  async createOrder(userId: string) {
    const cartItems = await this.cartItemService.findAll(userId);
    if (cartItems.length === 0) {
      throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
    }

    let totalCostCents = 0;
    const products = await Promise.all(
      cartItems.map(async (item) => {
        const productDetail = await this.productService.findOne(item.productId);
        if (!productDetail) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        const deliveryOption = await this.delOptService.findOne(
          item.deliveryOptionId,
        );
        if (!deliveryOption) {
          throw new Error(`Invalid delivery option: ${item.deliveryOptionId}`);
        }

        const productCost = productDetail.priceCents * item.quantity;
        const shippingCost = deliveryOption.priceCents;
        totalCostCents += productCost + shippingCost;
        const estimatedDeliveryTimeMs =
          Date.now() + deliveryOption.deliveryDays * 24 * 60 * 60 * 1000;
        return {
          productId: item.productId,
          quantity: item.quantity,
          estimatedDeliveryTimeMs,
        };
      }),
    );

    totalCostCents = Math.round(totalCostCents * 1.1);
    const newOrder = this.orderRepository.create({
      userId,
      orderTimeMs: String(Date.now()),
      totalCostCents,
      products,
    });

    await this.orderRepository.save(newOrder);
    await this.cartItemService.removeAllItems(userId);

    return newOrder;
  }

  removeAllOrder(userId: string) {
    return this.orderRepository.delete({ userId });
  }
}
