import { Controller, Get, Param } from '@nestjs/common';
import { InfluencerCategoryService } from '../service/influencer-category.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Influencer Category Management')
@Controller('influencer-category')
export class InfluencerCategoryController {
  constructor(
    private readonly influencerCategoryService: InfluencerCategoryService,
  ) {}

  @Get()
  async getAllCategories() {
    const categories = await this.influencerCategoryService.getAllCategories();
    return { categories };
  }

  @Get('sub-categories/:categoryId')
  async getSubCategories(@Param('categoryId') categoryId: string) {
    const subCategories =
      await this.influencerCategoryService.getSubCategories(categoryId);
    return { subCategories };
  }
}
