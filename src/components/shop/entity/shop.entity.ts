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

export class Location {
  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 7 })
  lat: number;

  @Column('decimal', { precision: 10, scale: 7 })
  lng: number;
}
@Entity('shops')
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  shopId: string;

  @Column({ default: 0, type: 'decimal' })
  rating: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column(() => Location)
  location: Location;

  @Column({ type: 'uuid' })
  influencerId: string;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

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
