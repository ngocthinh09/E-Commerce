import { DataSource } from 'typeorm';
import { Product } from '../../../modules/product/product.entity';
import { defaultProducts } from '../data/products';

export async function seedProducts(dataSource: DataSource) {
  const productRepository = dataSource.getRepository(Product);
  await productRepository.upsert(defaultProducts, ['id']);
  console.log('Products seeded successfully!');
}
