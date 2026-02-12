import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
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

  @Column({ type: 'text', nullable: false })
  keywords: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  getKeywordsArray(): string[] {
    return this.keywords.split(',');
  }

  setKeywordsArray(keywords: string[]): void {
    this.keywords = keywords.join(',');
  }
}
