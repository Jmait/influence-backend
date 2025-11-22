import { User } from 'src/components/user/entities/user.entity';
import { Shop } from '../../../components/shop/entity/shop.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { InfluencerProfile } from 'src/components/influencers/entities/influencer.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  productId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'decimal', default: 0 })
  rating: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'uuid' })
  shopId: string;

  @Column({ type: 'uuid' })
  influencerId: string;

  @ManyToOne(() => Shop, (shop) => shop.products)
  shop: Shop;

  @ManyToOne(() => InfluencerProfile, (influencer) => influencer.products)
  influencer: InfluencerProfile;

  @Column({ nullable: true })
  description: string;
}
