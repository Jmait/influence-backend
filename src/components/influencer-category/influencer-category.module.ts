import { InfluencerCategory } from './entities/influencer-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfluencerCategoryController } from './controller/influencer-category.controller';
import { InfluencerCategoryService } from './service/influencer-category.service';
import { Module } from '@nestjs/common';
import { InfluencerSubCategory } from './entities/influencer-sub.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InfluencerCategory, InfluencerSubCategory]),
  ],
  controllers: [InfluencerCategoryController],
  providers: [InfluencerCategoryService],
  exports: [InfluencerCategoryService],
})
export class InfluencerCategoryModule {}
