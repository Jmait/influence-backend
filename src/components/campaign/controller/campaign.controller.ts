import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';

import {
  CreateServiceDto,
  UpdateCampaignDto,
} from '../dto/create-camapign.dto';
import { JwtGuard } from 'src/components/auth/guards/jwt.guard';
import { CampaignService } from '../service/campaign-service.service';
import { SuccessResponse } from 'src/shared/utils/api-response';
import { Public } from 'src/shared/decorator/decorators';

@ApiTags('Campaign  Management')
@ApiBearerAuth('Bearer')
@Controller('campaign')
export class InfluencerCampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get('list/:influencerId')
  async getServiceList(
    @Req() req: ProfileRequestOptions,
    @Param('influencerId') influencerId: string,
  ) {
    const result = await this.campaignService.getInfluencerServices(
      req,
      influencerId,
    );
    return result;
  }

  @Post()
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtGuard)
  async createCampaign(
    @Req() req: ProfileRequestOptions,
    @Body() body: CreateServiceDto,
  ) {
    const result = await this.campaignService.CreateCampaign(
      body,
      req.user.influencerProfileId as string,
    );
    return result;
  }

  @Delete(':campaignId')
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtGuard)
  async deleteCampaign(@Param('campaignId') campaignId: string) {
    const result = await this.campaignService.deleteCampaign(campaignId);
    return SuccessResponse(result, 'Campaign deleted successfully');
  }

  @Get(':campaignId')
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtGuard)
  async getCampaignDetails(@Param('campaignId') campaignId: string) {
    const result = await this.campaignService.getCampaignDetails(campaignId);
    return result;
  }

  @Patch(':campaignId')
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtGuard)
  async updateCampaign(
    @Body() body: UpdateCampaignDto,
    @Param('campaignId') campaignId: string,
  ) {
    const result = await this.campaignService.updateCampaign(body, campaignId);
    return SuccessResponse(result, 'Campaign updated successfully');
  }

  @Public()
  @Get('categories')
  async getServiceCategories() {
    const result = await this.campaignService.getServiceCategories();
    return result;
  }
}
