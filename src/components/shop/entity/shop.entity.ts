import { InfluencerProfile } from 'src/components/influencers/entities/influencer.entity';
import { Product } from 'src/components/products/entities/product.entity';
import {
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Entity } from 'typeorm';

@Entity('shops')
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  shopId: string;

  @Column({ default: 0, type: 'decimal' })
  rating: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'uuid' })
  influencerId: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  categoryId: string;

  @Column({ nullable: true })
  coverImage: string;

  @OneToMany(() => Product, (product) => product.shop)
  products: Product[];

  @ManyToOne(() => InfluencerProfile, (influencer) => influencer.shops)
  @JoinColumn({ name: 'influencerId' })
  influencer: InfluencerProfile;
}
