import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InfluencerCategory } from './influencer-category.entity';

@Entity('influencer_sub_category')
export class InfluencerSubCategory {
  @PrimaryGeneratedColumn('uuid')
  subCategoryId: string;

  @Column({ type: 'varchar', length: 255 })
  subCategoryName: string;

  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => InfluencerCategory, (category) => category.subCategories)
  @JoinColumn({ name: 'categoryId' })
  category: InfluencerCategory;
}
