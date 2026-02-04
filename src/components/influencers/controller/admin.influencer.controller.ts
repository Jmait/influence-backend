import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InfluencerService } from '../service/influencer.service';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';

@ApiTags('Admin Influencer Management')
@Controller('admin/influencer')
export class AdminInfluencerManagementController {
  constructor(private readonly influencerService: InfluencerService) {}

  @Post('block/:profileId')
  @ApiOperation({
    summary: 'Block or unblock an influencer',
    description:
      'Toggle influencer block status. If influencer is blocked, they will be unblocked and vice versa',
  })
  @ApiParam({ name: 'profileId', description: 'Influencer Profile ID' })
  async blockInfluencer(@Param('profileId') profileId: string) {
    return await this.influencerService.blockInfluencer(profileId);
  }

  @Post('verify/:profileId')
  @ApiOperation({
    summary: 'Approve or revoke influencer verification',
    description:
      'Toggle influencer verification status. If influencer is verified, verification will be removed and vice versa',
  })
  @ApiParam({ name: 'profileId', description: 'Influencer Profile ID' })
  async approveVerification(@Param('profileId') profileId: string) {
    return await this.influencerService.approveVerification(profileId);
  }

  @Delete('delete/:profileId')
  @ApiOperation({
    summary: 'Delete an influencer account',
    description:
      'Soft delete an influencer account and remove associated images from storage',
  })
  @ApiParam({ name: 'profileId', description: 'Influencer Profile ID' })
  async deleteAccount(@Param('profileId') profileId: string) {
    return await this.influencerService.deleteInfluencerAccount(profileId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all influencers',
    description:
      'Retrieve all influencers with their user details, category, shop count, and product count',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search query for username, name, or email',
  })
  async getInfluencers(@Req() req: ProfileRequestOptions) {
    return await this.influencerService.getInfluencersForAdmin(req);
  }
}
