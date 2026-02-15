import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { ProductModule } from '../product/product.module';
import { DeliveryOptionModule } from '../delivery-option/delivery-option.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem]),
    ProductModule,
    DeliveryOptionModule,
  ],
  providers: [CartItemService],
  controllers: [CartItemController],
  exports: [CartItemService],
})
export class CartItemModule {}
