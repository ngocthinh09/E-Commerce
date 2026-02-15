import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItem } from './cart-item.entity';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.entity';
import { UpdateItemDto } from './dto/update-item.dto';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('cart-items')
export class CartItemController {
  constructor(
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductService,
  ) {}

  @Get()
  async findAll(@Query('expand') expand: string) {
    const cartItems = await this.cartItemService.findAll();
    if (expand === 'product') {
      const response: CartItem[] = [];
      for (const item of cartItems) {
        const product = await this.productService.findOne(item.productId);
        response.push({
          ...item,
          product: product as Product,
        });
      }
      return response;
    }
    return cartItems;
  }

  @Post()
  createCartItem(@Body() { productId, quantity }: CreateItemDto) {
    return this.cartItemService.createCartItem(productId, quantity);
  }

  @Put(':productId')
  updateCartItem(
    @Param('productId') productId: string,
    @Body() body: UpdateItemDto,
  ) {
    return this.cartItemService.updateCartItem({
      productId: productId,
      quantity: body?.quantity,
      deliveryOptionId: body?.deliveryOptionId,
    });
  }

  @Delete('/:productId')
  removeItem(@Param('productId') productId: string) {
    return this.cartItemService.removeItem(productId);
  }
}
