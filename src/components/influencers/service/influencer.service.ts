import { BadRequestException, Injectable, Req } from '@nestjs/common';
import {
  UpdateOrCreateInfluencerProfileDto,
  UserType,
} from 'src/components/auth/dto/auth.dto';
import { AuthService } from 'src/components/auth/service/auth.service';
import { StorageService } from 'src/components/storage/storage.service';
import { GetUserPublicrofileDto } from 'src/components/user/dto/user.dto';
import { User } from 'src/components/user/entities/user.entity';
import { UserService } from 'src/components/user/service/user.service';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InfluencerProfile } from '../entities/influencer.entity';

@Injectable()
export class InfluencerService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly storageService: StorageService,
    @InjectRepository(InfluencerProfile)
    private readonly influencerRepo: Repository<InfluencerProfile>,
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
    files: Express.Multer.File[],
  ) {
    const profile = await this.userService.createOrUpdateInfluencerProfile(
      body,
      type,
      user,
      files,
    );
    const token = this.authService.generateToken({
      user: profile,
      influencerProfileId: profile?.influencerProfile.influencerProfileId,
    });
    return { profile, token };
  }

  // Admin methods
  async blockInfluencer(profileId: string) {
    try {
      const profile = await this.influencerRepo.findOne({
        where: { influencerProfileId: profileId },
      });
      if (!profile) {
        throw new BadRequestException('Influencer profile not found');
      }

      // Toggle block: if blocked, unblock; if not blocked, block
      const blockedAt = profile.blockedAt ? null : new Date();
      const updateData: any = { blockedAt };
      await this.influencerRepo.update(profileId, updateData);

      return {
        message: blockedAt
          ? 'Influencer blocked successfully'
          : 'Influencer unblocked successfully',
        blockedAt,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async approveVerification(profileId: string) {
    try {
      const profile = await this.influencerRepo.findOne({
        where: { influencerProfileId: profileId },
      });
      if (!profile) {
        throw new BadRequestException('Influencer profile not found');
      }

      // Toggle verification status
      const verified = !profile.verified;
      await this.influencerRepo.update(profileId, { verified });

      return {
        message: verified
          ? 'Influencer verified successfully'
          : 'Influencer verification removed',
        verified,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteInfluencerAccount(profileId: string) {
    try {
      const profile = await this.influencerRepo.findOne({
        where: { influencerProfileId: profileId },
      });
      if (!profile) {
        throw new BadRequestException('Influencer profile not found');
      }

      // Delete associated images from storage if they exist
      if (profile.coverImage) {
        const coverImageKey = this.storageService.extractS3Key(
          profile.coverImage,
        );
        if (coverImageKey) {
          await this.storageService.deleteFile(coverImageKey);
        }
      }
      if (profile.profileImages && profile.profileImages.length > 0) {
        for (const image of profile.profileImages) {
          const imageKey = this.storageService.extractS3Key(image);
          if (imageKey) {
            await this.storageService.deleteFile(imageKey);
          }
        }
      }

      // Soft delete by setting deletedAt
      await this.influencerRepo.update(profileId, { deletedAt: new Date() });
      return { message: 'Influencer account deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getInfluencersForAdmin(options: ProfileRequestOptions) {
    try {
      let query = this.influencerRepo
        .createQueryBuilder('influencer')
        .leftJoinAndSelect('influencer.user', 'user')
        .leftJoinAndSelect('influencer.category', 'category')
        .leftJoin('influencer.shops', 'shops')
        .leftJoin('influencer.products', 'products')
        .loadRelationCountAndMap('influencer.shopCount', 'influencer.shops')
        .loadRelationCountAndMap(
          'influencer.productCount',
          'influencer.products',
        );

      if (options.query.q) {
        query = query.andWhere(
          'influencer.username ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search',
          { search: `%${options.query.q}%` },
        );
      }

      const [influencers, count] = await query.getManyAndCount();
      return { influencers, count };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
