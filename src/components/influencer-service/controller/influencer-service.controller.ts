import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { InfluncerServiceAsproduct } from '../service/sponsor-service.service';
import { CreateServiceDto } from '../dto/create-service.dto';
import { JwtGuard } from 'src/components/auth/guards/jwt.guard';

@ApiTags('Influencer Service Management')
@Controller('influencer-service')
export class InfluencerServiceController {
  constructor(private readonly influencerService: InfluncerServiceAsproduct) {}

  @Get('list/:influencerId')
  async getServiceList(
    @Req() req: ProfileRequestOptions,
    @Param('influencerId') influencerId: string,
  ) {
    const result = await this.influencerService.getInfluencerServices(
      req,
      influencerId,
    );
    return result;
  }

  @Post()
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtGuard)
  async createService(
    @Req() req: ProfileRequestOptions,
    @Body() body: CreateServiceDto,
  ) {
    const result = await this.influencerService.CreateService(
      body,
      req.user.influencerProfileId as string,
    );
    return result;
  }

  @Get('categories')
  async getServiceCategories() {
    const result = await this.influencerService.getServiceCategories();
    return result;
  }
}
