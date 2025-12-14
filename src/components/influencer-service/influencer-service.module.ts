import { Module } from '@nestjs/common';
import { InfluencerServiceController } from './controller/influencer-service.controller';
import { InfluncerServiceAsproduct } from './service/sponsor-service.service';
import { Campaigns } from './entities/influencer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfluncerServiceCategory } from './entities/service_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaigns, InfluncerServiceCategory])],
  providers: [InfluncerServiceAsproduct],
  controllers: [InfluencerServiceController],
})
export class InfluencerServiceModule {}
