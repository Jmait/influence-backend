import { InfluencerCategory } from 'src/components/influencer-category/entities/influencer-category.entity';
import { DataSource, In } from 'typeorm';
import {
  INFLUENCER_CATEGORIES,
  INFLUENCER_SERVICE_CATEGORIES,
  INFLUENCER_SUBCATEGORIES,
} from './influencer-category/influencer-category';
import { InfluencerSubCategory } from 'src/components/influencer-category/entities/influencer-sub.entity';
import { InfluencerCategoryService } from 'src/components/influencer-category/service/influencer-category.service';
import { InfluncerServiceCategory } from 'src/components/influencer-service/entities/service_category.entity';

export class MainSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    await this.seedCategories();

    await this.serviceCategories();
  }

  private async seedCategories() {
    const categoryRepo = this.dataSource.getRepository(InfluencerCategory);
    const subcategoryRepo = this.dataSource.getRepository(
      InfluencerSubCategory,
    );

    for (const category of INFLUENCER_CATEGORIES) {
      const exists = await categoryRepo.findOne({
        where: { categoryId: category.categoryId },
      });
      if (!exists) {
        await categoryRepo.save({
          categoryId: category.categoryId,
          categoryName: category.categoryName,
        });
      }

      for (const sub of INFLUENCER_SUBCATEGORIES) {
        const subExists = await subcategoryRepo.findOne({
          where: { subCategoryId: sub.subCategoryId },
        });
        if (!subExists) {
          await subcategoryRepo.save({
            subCategoryId: sub.subCategoryId,
            subCategoryName: sub.subCategoryName,
            categoryId: sub.categoryId,
          });
        }
      }
    }
  }

  private async serviceCategories() {
    const categoryRepo = this.dataSource.getRepository(
      InfluncerServiceCategory,
    );

    for (const category of INFLUENCER_SERVICE_CATEGORIES) {
      const exists = await categoryRepo.findOne({
        where: { serviceCategoryId: category.serviceCategoryId },
      });
      if (!exists) {
        await categoryRepo.save({
          serviceCategoryId: category.serviceCategoryId,
          name: category.name,
        });
      }
    }
  }
}
