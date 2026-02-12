import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DeliveryOption } from '../delivery-option/delivery-option.entity';
import { Product } from '../product/product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'uuid', nullable: false })
  productId: string;

  @ManyToOne(() => Product, { eager: false })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'integer', nullable: false })
  quantity: number;

  @Column({ type: 'varchar', nullable: false })
  deliveryOptionId: string;

  @ManyToOne(() => DeliveryOption, { eager: false })
  @JoinColumn({ name: 'deliveryOptionId' })
  deliveryOption: DeliveryOption;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
