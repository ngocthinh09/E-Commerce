import { Module } from '@nestjs/common';
import { ResetController } from './reset.controller';
import { CartItemModule } from '../cart-item/cart-item.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [CartItemModule, OrderModule],
  controllers: [ResetController],
})
export class ResetModule {}
