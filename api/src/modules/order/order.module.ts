import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { ProductModule } from '../product/product.module';
import { CartItemModule } from '../cart-item/cart-item.module';
import { DeliveryOptionModule } from '../delivery-option/delivery-option.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ProductModule,
    CartItemModule,
    DeliveryOptionModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
