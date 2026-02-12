import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('delivery_options')
export class DeliveryOption {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'integer', nullable: false })
  deliveryDays: number;

  @Column({ type: 'integer', nullable: false })
  priceCents: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_STAMP',
  })
  updatedAt: Date;
}
