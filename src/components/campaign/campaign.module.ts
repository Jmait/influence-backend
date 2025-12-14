import { Module } from '@nestjs/common';
import { InfluencerCampaignController } from './controller/campaign.controller';
import { Campaigns } from './entities/campaign.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignCategory } from './entities/campaign_category.entity';
import { CampaignService } from './service/campaign-service.service';

@Module({
  imports: [TypeOrmModule.forFeature([Campaigns, CampaignCategory])],
  providers: [CampaignService],
  controllers: [InfluencerCampaignController],
})
export class CampaignModule {}
