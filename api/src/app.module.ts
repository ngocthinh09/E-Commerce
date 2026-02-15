import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './modules/product/product.module';
import { LoggingMiddleware } from './middleware/logging/logging.middleware';
import { DeliveryOptionModule } from './modules/delivery-option/delivery-option.module';
import { PaymentSummaryModule } from './modules/payment-summary/payment-summary.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ProductModule,
    DeliveryOptionModule,
    PaymentSummaryModule,
    CartItemModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('{*path}');
  }
}
