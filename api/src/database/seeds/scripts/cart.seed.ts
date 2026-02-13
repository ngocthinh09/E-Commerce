import { DataSource } from 'typeorm';
import { CartItem } from '../../../modules/cart-item/cart-item.entity';
import { defaultCart } from '../data/cart';

export async function seedCart(dataSource: DataSource) {
  const cartRepository = dataSource.getRepository(CartItem);
  await cartRepository.upsert(defaultCart, ['id']);
  console.log('Cart items seeded succesfully!');
}
