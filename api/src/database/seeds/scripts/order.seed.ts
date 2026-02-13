import { DataSource } from 'typeorm';
import { Order } from '../../../modules/order/order.entity';
import { defaultOrders } from '../data/orders';

export async function seedOrder(dataSource: DataSource) {
  const orderRepository = dataSource.getRepository(Order);
  await orderRepository.upsert(defaultOrders, ['id']);
  console.log('Orders seeded succesfully!');
}
