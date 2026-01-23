import { Product } from 'src/components/products/entities/product.entity';
import { User } from '../../user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Shop } from '../../../components/shop/entity/shop.entity';
import { InfluencerCategory } from 'src/components/influencer-category/entities/influencer-category.entity';
import { Review } from '../../../components/reviews/entities/review.entity';

@Entity('influencer_profiles')
export class InfluencerProfile {
  @PrimaryGeneratedColumn('uuid')
  influencerProfileId: string;

  @Column({ type: 'uuid', unique: true })
  userId: string;

  @OneToOne(() => User, (user) => user.influencerProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text', unique: true })
  @Index('idx_influencer_profiles_username')
  username: string;

  @Column({ type: 'uuid' })
  categoryId: string;

  @Column({ type: 'uuid' })
  subCategoryId: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'boolean', default: false })
  @Index('idx_influencer_profiles_verified')
  verified: boolean;

  @Column({
    type: 'jsonb',
    default:
      '{"instagram": {"handle": "", "followers": 0}, "youtube": {"handle": "", "followers": 0}, "twitter": {"handle": "", "followers": 0}, "tiktok": {"handle": "", "followers": 0}}',
    nullable: true,
  })
  socialMedia: Record<string, any>;

  @Column({ type: 'int', default: 0 })
  @Index('idx_influencer_profiles_total_followers')
  totalFollowers: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  averageEngagement: number;

  @Column({ type: 'int', default: 0 })
  collaborationCount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @Column({ type: 'text', nullable: true })
  coverImage: string;

  @Column({ type: 'text', nullable: true, array: true })
  profileImages: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => Product, (product) => product.influencer)
  products: Product[];

  @OneToMany(() => Review, (review) => review.influencer)
  reviews: Review[];

  @OneToMany(() => Shop, (shop) => shop.influencer)
  shops: Shop[];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => InfluencerCategory, (category) => category.influencers, {
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: InfluencerCategory;
}
