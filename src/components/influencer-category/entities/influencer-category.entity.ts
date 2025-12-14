import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InfluencerSubCategory } from './influencer-sub.entity';
import { InfluencerProfile } from 'src/components/influencers/entities/influencer.entity';
import { Product } from 'src/components/products/entities/product.entity';

@Entity('influencer_category')
export class InfluencerCategory {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column({ type: 'varchar', length: 255 })
  categoryName: string;

  @OneToMany(() => InfluencerSubCategory, (subCategory) => subCategory.category)
  subCategories: InfluencerSubCategory[];

  @OneToMany(() => InfluencerProfile, (influencer) => influencer.category, {
    nullable: true,
  })
  influencers: InfluencerProfile[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
