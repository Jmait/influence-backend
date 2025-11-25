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

  @Get(':influencerId')
  async getInfluencerSingleProfile(
    @Param('influencerId') influencerId: string,
  ) {
    const result =
      await this.influencerService.getInfluencerPublicProfile(influencerId);
    return { result };
  }
}
