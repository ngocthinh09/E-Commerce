import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItem } from './cart-item.entity';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.entity';
import { UpdateItemDto } from './dtos/update-item.dto';
import { CreateItemDto } from './dtos/create-item.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';

@Controller('cart-items')
@UseGuards(JwtAuthGuard)
export class CartItemController {
  constructor(
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductService,
  ) {}

  @Get()
  async findAll(@User('id') userId: string, @Query('expand') expand: string) {
    const cartItems = await this.cartItemService.findAll(userId);
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
  createCartItem(
    @User('id') userId: string,
    @Body() createItemDto: CreateItemDto,
  ) {
    return this.cartItemService.createCartItem(userId, createItemDto);
  }

  @Put(':productId')
  updateCartItem(
    @User('id') userId: string,
    @Param('productId') productId: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.cartItemService.updateCartItem(
      userId,
      productId,
      updateItemDto,
    );
  }

  @Delete()
  removeAllItems(@User('id') userId: string) {
    return this.cartItemService.removeAllItems(userId);
  }

  @Delete('/:productId')
  removeItem(
    @User('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartItemService.removeItem(userId, productId);
  }
}
