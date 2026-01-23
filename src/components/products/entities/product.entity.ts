import { Shop } from '../../../components/shop/entity/shop.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { InfluencerProfile } from 'src/components/influencers/entities/influencer.entity';
import { ProductVariants } from './product-variants.entity';
import { InfluencerCategory } from 'src/components/influencer-category/entities/influencer-category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  productId: string;

  @Column()
  name: string;

  @Column({
    type: 'text',
    array: true,
    nullable: true,
  })
  images: string[];

  @Column({ nullable: true })
  sku: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'decimal', default: 0 })
  rating: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'uuid' })
  shopId: string;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string;

  @Column({ type: 'decimal', default: 0 })
  quantity: number;

  @Column({ type: 'decimal', default: 0 })
  deliveryFee: number;

  @Column({ type: 'text', nullable: true })
  productTerms: string;

  @Column({ type: 'uuid' })
  influencerId: string;

  @ManyToOne(() => Shop, (shop) => shop.products)
  @JoinColumn({ name: 'shopId' })
  shop: Shop;

  @ManyToOne(() => InfluencerProfile, (influencer) => influencer.products)
  @JoinColumn({ name: 'influencerId' })
  influencer: InfluencerProfile;

  @OneToMany(() => ProductVariants, (variants) => variants.product, {
    nullable: true,
  })
  variants: ProductVariants[];

  @ManyToOne(() => InfluencerCategory, (category) => category.products, {
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: InfluencerCategory;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  description: string;
}
