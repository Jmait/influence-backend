import { BadRequestException, Injectable, Req } from '@nestjs/common';
import {
  UpdateOrCreateInfluencerProfileDto,
  UserType,
} from 'src/components/auth/dto/auth.dto';
import { AuthService } from 'src/components/auth/service/auth.service';
import { GetUserPublicrofileDto } from 'src/components/user/dto/user.dto';
import { User } from 'src/components/user/entities/user.entity';
import { UserService } from 'src/components/user/service/user.service';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';

@Injectable()
export class InfluencerService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

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

  async createOrUpdateInfluencerProfile(
    body: UpdateOrCreateInfluencerProfileDto,
    type: UserType,
    user: User,
  ) {
    const profile = await this.userService.createOrUpdateInfluencerProfile(
      body,
      type,
      user,
    );
    const token = this.authService.generateToken({
      user: profile,
      influencerProfileId: profile?.influencerProfile.influencerProfileId,
    });
    return { profile, token };
  }
}
