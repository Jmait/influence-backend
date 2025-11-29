import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { GetUserPublicrofileDto } from 'src/components/user/dto/user.dto';
import { UserService } from 'src/components/user/service/user.service';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';

@Injectable()
export class InfluencerService {
  constructor(private readonly userService: UserService) {}

  async getInfluencerProfile(
    dto: GetUserPublicrofileDto,
    options: ProfileRequestOptions,
  ) {
    try {
      return await this.userService.getAllInfluencers(dto, options);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getInfluencerPublicProfile(userId: string) {
    try {
      const profile = await this.userService.getInflucerPublicProfile(userId);
      console.log('Fetched influencer profile:', profile);
      return profile;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
