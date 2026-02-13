import { DataSource } from 'typeorm';
import { DeliveryOption } from '../../../modules/delivery-option/delivery-option.entity';
import { defaultDeliveryOptions } from '../data/delivery-options';

export async function seedDeliveryOptions(dataSource: DataSource) {
  const delOptRepository = dataSource.getRepository(DeliveryOption);
  await delOptRepository.upsert(defaultDeliveryOptions, ['id']);
  console.log('Delivery options seeded successfully!');
}
