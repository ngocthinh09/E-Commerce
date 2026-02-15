import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { seedProducts } from './scripts/product.seed';
import { seedDeliveryOptions } from './scripts/delivery-option.seed';
import { seedOrder } from './scripts/order.seed';
import { seedCart } from './scripts/cart.seed';

async function runSeeds() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    await seedProducts(dataSource);
    await seedDeliveryOptions(dataSource);
    await seedCart(dataSource);
    await seedOrder(dataSource);
    console.log('Seed completed!');
  } finally {
    await app.close();
  }
}
runSeeds();
