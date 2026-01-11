import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InfluencerService } from '../service/influencer.service';
import { GetUserPublicrofileDto } from 'src/components/user/dto/user.dto';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { JwtGuard } from 'src/components/auth/guards/jwt.guard';
import { UpdateOrCreateInfluencerProfileDto } from 'src/components/auth/dto/auth.dto';

@ApiTags('Influencer Management')
@Controller('influencer')
export class InfluencerController {
  constructor(private readonly influencerService: InfluencerService) {}

  @Get()
  async getInfluencerProfile(
    @Query() dto: GetUserPublicrofileDto,
    @Req() req: ProfileRequestOptions,
  ) {
    return await this.influencerService.getInfluencerProfile(dto, req);
  }

  @Get(':influencerId')
  async getInfluencerSingleProfile(
    @Param('influencerId') influencerId: string,
  ) {
    const result =
      await this.influencerService.getInfluencerPublicProfile(influencerId);
    return { result };
  }

  @ApiBearerAuth('Bearer')
  @Post('setup-profile')
  @UseGuards(JwtGuard)
  async createOrUpdateInfluencerProfile(
    @Body() body: UpdateOrCreateInfluencerProfileDto,
    @Req() req,
  ) {
    console.log(req.user);
    return await this.influencerService.createOrUpdateInfluencerProfile(
      body,
      req.user.type,
      req.user,
    );
  }
}
