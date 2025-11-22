import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InfluencerService } from '../service/influencer.service';
import { GetUserPublicrofileDto } from 'src/components/user/dto/user.dto';

@ApiTags('Influencer Management')
@Controller('influencer')
export class InfluencerController {
  constructor(private readonly influencerService: InfluencerService) {}

  @Get()
  async getInfluencerProfile(@Query() dto: GetUserPublicrofileDto) {
    return await this.influencerService.getInfluencerProfile(dto);
  }

  @Get(':userId')
  async getInfluencerSingleProfile(@Param('userId') userId: string) {
    return await this.influencerService.getInfluencerPublicProfile(userId);
  }
}
