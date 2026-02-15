import { Module } from '@nestjs/common';
import { PaymentSummaryController } from './payment-summary.controller';
import { PaymentSummaryService } from './payment-summary.service';
import { ProductModule } from '../product/product.module';
import { CartItemModule } from '../cart-item/cart-item.module';
import { DeliveryOptionModule } from '../delivery-option/delivery-option.module';

@Module({
  imports: [ProductModule, CartItemModule, DeliveryOptionModule],
  controllers: [PaymentSummaryController],
  providers: [PaymentSummaryService],
  exports: [PaymentSummaryService],
})
export class PaymentSummaryModule {}
