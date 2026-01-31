import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariants {
  @PrimaryGeneratedColumn('uuid')
  variantId: string;

  @Column('uuid')
  productId: string;

  @Column({ type: 'varchar' })
  variantName: string;

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @Column({ type: 'decimal', default: 0 })
  quantity: number;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;
}
