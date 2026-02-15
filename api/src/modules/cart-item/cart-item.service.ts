import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { Repository } from 'typeorm';
import { DeleteResult } from 'typeorm';
import { ProductService } from '../product/product.service';
import { DeliveryOptionService } from '../delivery-option/delivery-option.service';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly productService: ProductService,
    private readonly delOptService: DeliveryOptionService,
  ) {}

  findAll(): Promise<CartItem[]> {
    return this.cartItemRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async createCartItem(productId: string, quantity: number) {
    const product = await this.productService.findOne(productId);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    if (quantity < 1 || quantity > 10) {
      throw new HttpException(
        'Quantity must be a number between 1 and 10',
        HttpStatus.BAD_REQUEST,
      );
    }

    let cartItem = await this.cartItemRepository.findOneBy({ productId });
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        productId,
        quantity,
        deliveryOptionId: '1',
      });
    }
    await this.cartItemRepository.save(cartItem);

    return cartItem;
  }

  async updateCartItem(args: {
    productId: string;
    quantity: number | undefined;
    deliveryOptionId: string | undefined;
  }) {
    const cartItem = await this.cartItemRepository.findOneBy({
      productId: args.productId,
    });
    if (!cartItem) {
      throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
    }

    if (args.quantity !== undefined) {
      if (args.quantity < 1) {
        throw new HttpException(
          'Quantity must be a number greater than 0',
          HttpStatus.BAD_REQUEST,
        );
      }
      cartItem.quantity = args.quantity;
    }

    if (args.deliveryOptionId !== undefined) {
      const deliveryOption = await this.delOptService.findOne(
        args.deliveryOptionId,
      );
      if (!deliveryOption) {
        throw new HttpException(
          'Invalid delivery option',
          HttpStatus.BAD_REQUEST,
        );
      }
      cartItem.deliveryOptionId = args.deliveryOptionId;
    }

    await this.cartItemRepository.save(cartItem);
    return cartItem;
  }

  removeItem(productId: string): Promise<DeleteResult> {
    return this.cartItemRepository.delete({ productId: productId });
  }

  removeAllItems(): Promise<void> {
    return this.cartItemRepository.clear();
  }
}
