import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InfluencerCategory } from '../entities/influencer-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InfluencerSubCategory } from '../entities/influencer-sub.entity';

@Injectable()
export class InfluencerCategoryService {
  constructor(
    @InjectRepository(InfluencerCategory)
    private categoryRepository: Repository<InfluencerCategory>,

    @InjectRepository(InfluencerSubCategory)
    private subCategoryRepository: Repository<InfluencerSubCategory>,
  ) {}

  async getAllCategories() {
    try {
      const categories = this.categoryRepository
        .createQueryBuilder('category')
        .leftJoin('category.influencers', 'influencer')
        .loadRelationCountAndMap(
          'category.influencerCount',
          'category.influencers',
        );
      const [records, count] = await categories.getManyAndCount();
      return { records, count };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getSubCategories(categoryId: string) {
    try {
      const subCategories = this.subCategoryRepository
        .createQueryBuilder('subCategory')
        .where('subCategory.categoryId = :categoryId', { categoryId });
      const [records, counts] = await subCategories.getManyAndCount();
      return { records, counts };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
