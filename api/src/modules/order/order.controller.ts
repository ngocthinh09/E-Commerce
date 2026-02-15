import {
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ProductService } from '../product/product.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}

  @Get()
  async findAll(@Query('expand') expand: string) {
    let orders = await this.orderService.findAll();
    if (expand === 'products') {
      orders = await Promise.all(
        orders.map(async (order) => {
          const products = await Promise.all(
            order.products.map(async (item) => {
              const productDetails = await this.productService.findOne(
                item.productId,
              );
              return {
                ...item,
                product: productDetails || undefined,
              };
            }),
          );

          return {
            ...order,
            products,
          };
        }),
      );
    }
    return orders;
  }

  @Get('/:orderId')
  async findOne(
    @Param('orderId') orderId: string,
    @Query('expand') expand: string,
  ) {
    const order = await this.orderService.findOne(orderId);

    if (!order) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Order not found',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (expand === 'products') {
      const products = await Promise.all(
        order.products.map(async (item) => {
          const productDetails = await this.productService.findOne(
            item.productId,
          );
          return {
            ...item,
            product: productDetails || undefined,
          };
        }),
      );

      return {
        ...order,
        products,
      };
    }
    return order;
  }

  @Post()
  createOrder() {
    return this.orderService.createOrder();
  }
}
