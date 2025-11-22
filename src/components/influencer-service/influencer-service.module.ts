import { Module } from '@nestjs/common';
import { InfluencerServiceController } from './controller/influencer-service.controller';
import { InfluncerServiceAsproduct } from './service/sponsor-service.service';

@Module({
  imports: [],
  providers: [InfluncerServiceAsproduct],
  controllers: [InfluencerServiceController],
})
export class InfluencerServiceModule {}
