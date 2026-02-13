import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  image: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'jsonb', nullable: false })
  rating: {
    stars: number;
    count: number;
  };

  @Column({ type: 'integer', nullable: false })
  priceCents: number;

  @Column({ type: 'simple-array', nullable: false })
  keywords: string[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
