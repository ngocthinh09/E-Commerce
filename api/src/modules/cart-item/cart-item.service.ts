import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { Repository } from 'typeorm';
import { DeleteResult } from 'typeorm';
import { ProductService } from '../product/product.service';
import { DeliveryOptionService } from '../delivery-option/delivery-option.service';
import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly productService: ProductService,
    private readonly delOptService: DeliveryOptionService,
  ) {}

  findAll(userId: string): Promise<CartItem[]> {
    return this.cartItemRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async createCartItem(userId: string, createItemDto: CreateItemDto) {
    const { productId, quantity } = createItemDto;
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

    let cartItem = await this.cartItemRepository.findOne({
      where: { userId, productId },
    });
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        userId,
        productId,
        quantity,
        deliveryOptionId: '1',
      });
    }
    await this.cartItemRepository.save(cartItem);

    return cartItem;
  }

  async updateCartItem(
    userId: string,
    productId: string,
    updateItemDto: UpdateItemDto,
  ) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { userId, productId },
    });
    if (!cartItem) {
      throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
    }

    const { quantity, deliveryOptionId } = updateItemDto;

    if (quantity !== undefined) {
      if (quantity < 1) {
        throw new HttpException(
          'Quantity must be a number greater than 0',
          HttpStatus.BAD_REQUEST,
        );
      }
      cartItem.quantity = quantity;
    }

    if (deliveryOptionId !== undefined) {
      const deliveryOption = await this.delOptService.findOne(deliveryOptionId);
      if (!deliveryOption) {
        throw new HttpException(
          'Invalid delivery option',
          HttpStatus.BAD_REQUEST,
        );
      }
      cartItem.deliveryOptionId = deliveryOptionId;
    }

    await this.cartItemRepository.save(cartItem);
    return cartItem;
  }

  removeItem(userId: string, productId: string): Promise<DeleteResult> {
    return this.cartItemRepository.delete({ userId, productId });
  }

  removeAllItems(userId: string): Promise<DeleteResult> {
    return this.cartItemRepository.delete({ userId });
  }
}
