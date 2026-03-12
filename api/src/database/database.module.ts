import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../modules/product/product.entity';
import { DeliveryOption } from '../modules/delivery-option/delivery-option.entity';
import { CartItem } from '../modules/cart-item/cart-item.entity';
import { Order } from '../modules/order/order.entity';
import { User } from '../modules/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.getOrThrow<string>('DB_DRIVER') as any,
        url: configService.getOrThrow<string>('DATABASE_URL'),
        entities: [User, Product, DeliveryOption, CartItem, Order],
        synchronize:
          configService.getOrThrow<string>('NODE_ENV') !== 'production',
        ssl: { rejectUnauthorized: false },
      }),
    }),
  ],
})
export class DatabaseModule {}
