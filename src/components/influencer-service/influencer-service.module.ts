import { Module } from '@nestjs/common';
import { InfluencerServiceController } from './controller/influencer-service.controller';
import { InfluncerServiceAsproduct } from './service/sponsor-service.service';
import { InfluencerService } from './entities/influencer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfluncerServiceCategory } from './entities/service_category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InfluencerService, InfluncerServiceCategory]),
  ],
  providers: [InfluncerServiceAsproduct],
  controllers: [InfluencerServiceController],
})
export class InfluencerServiceModule {}
