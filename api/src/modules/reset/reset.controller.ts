import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartItemService } from '../cart-item/cart-item.service';
import { OrderService } from '../order/order.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';

@Controller('reset')
@UseGuards(JwtAuthGuard)
export class ResetController {
  constructor(
    private readonly cartItemService: CartItemService,
    private readonly orderService: OrderService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async reset(@User('id') userId: string) {
    await this.cartItemService.removeAllItems(userId);
    await this.orderService.removeAllOrder(userId);
  }
}
