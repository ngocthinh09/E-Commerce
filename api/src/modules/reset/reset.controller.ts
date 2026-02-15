import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CartItemService } from '../cart-item/cart-item.service';
import { OrderService } from '../order/order.service';

@Controller('reset')
export class ResetController {
  constructor(
    private readonly cartItemService: CartItemService,
    private readonly orderService: OrderService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async reset() {
    await this.cartItemService.removeAllItems();
    await this.orderService.removeAllOrder();
  }
}
