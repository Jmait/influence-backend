import { BadRequestException, Injectable } from '@nestjs/common';
import {
  RegisterDto,
  UpdateOrCreateInfluencerProfileDto,
  UserType,
} from 'src/components/auth/dto/auth.dto';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import * as argon2 from 'argon2';
import { InfluencerProfile } from 'src/components/influencers/entities/influencer.entity';
import {
  GetUserProfileDto,
  GetUserPublicrofileDto,
  SocialMedia,
} from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(InfluencerProfile)
    private readonly influencerRepo: Repository<InfluencerProfile>,
  ) {}

  async createUser(body: RegisterDto) {
    try {
      const { firstName, lastName, email, password, type } = body;
      const hashedPassword = await argon2.hash(password);
      const newUser = this.userRepo.create({
        firstName,
        lastName,
        email,
        type,
        password: hashedPassword,
      });
      const user = await this.userRepo.save(newUser);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createOrUpdateInfluencerProfile(
    body: UpdateOrCreateInfluencerProfileDto,
    type: UserType,
    user: User,
  ) {
    try {
      if (user.type === UserType.INFLUENCER) {
        const existingProfile = await this.influencerRepo.findOne({
          where: { userId: user.userId },
        });
        if (existingProfile) {
          Object.assign(existingProfile, body);
          await this.influencerRepo.save(existingProfile);
          return await this.userRepo.findOne({
            where: { userId: user.userId },
            relations: ['influencerProfile'],
          });
        }
        const profile = this.influencerRepo.create({
          ...body,
          userId: user.userId,
        });
        console.log('hi profile');
        await this.influencerRepo.save(profile);
      }
      return await this.userRepo.findOne({
        where: { userId: user.userId },
        relations: ['influencerProfile'],
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async connectInfluencerSocialMedia(dto: SocialMedia) {
    try {
      const influencer = await this.influencerRepo.findOne({
        where: { userId: dto.userId },
      });
      if (!influencer) {
        throw new BadRequestException('Influencer profile not found');
      }
      influencer.socialMedia = influencer.socialMedia || {};
      influencer.socialMedia[dto.platform] = {
        ...influencer.socialMedia[dto.platform],
        ...dto[dto.platform],
      };
      await this.influencerRepo.save(influencer);
      return influencer;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findUserByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }

  buildProfileSearchFilter(query: any) {
    const filter = {};

    if (query.username) {
      filter['user.username'] = query.username;
    }
    if (query.firstName) {
      filter['user.firstName'] = query.firstName;
    }
    if (query.lastName) {
      filter['user.lastName'] = query.lastName;
    }
    if (query.categoryId) {
      filter['influencerProfile.categoryId'] = query.categoryId;
    }
    if (query.subCategoryId) {
      filter['influencerProfile.subCategoryId'] = query.subCategoryId;
    }
    if (query.location) {
      filter['influencerProfile.location'] = query.location;
    }
    if (typeof query.verified === 'boolean') {
      filter['influencerProfile.verified'] = query.verified;
    }
    if (query.totalFollowersMin !== undefined) {
      filter['influencerProfile.totalFollowers'] =
        filter['influencerProfile.totalFollowers'] || {};
      filter['influencerProfile.totalFollowers']['$gte'] =
        query.totalFollowersMin;
    }
    if (query.totalFollowersMax !== undefined) {
      filter['influencerProfile.totalFollowers'] =
        filter['influencerProfile.totalFollowers'] || {};
      filter['influencerProfile.totalFollowers']['$lte'] =
        query.totalFollowersMax;
    }
    if (query.averageEngagementMin !== undefined) {
      filter['influencerProfile.averageEngagement'] =
        filter['influencerProfile.averageEngagement'] || {};
      filter['influencerProfile.averageEngagement']['$gte'] =
        query.averageEngagementMin;
    }
    if (query.averageEngagementMax !== undefined) {
      filter['influencerProfile.averageEngagement'] =
        filter['influencerProfile.averageEngagement'] || {};
      filter['influencerProfile.averageEngagement']['$lte'] =
        query.averageEngagementMax;
    }
    if (query.ratingMin !== undefined) {
      filter['influencerProfile.rating'] =
        filter['influencerProfile.rating'] || {};
      filter['influencerProfile.rating']['$gte'] = query.ratingMin;
    }
    if (query.ratingMax !== undefined) {
      filter['influencerProfile.rating'] =
        filter['influencerProfile.rating'] || {};
      filter['influencerProfile.rating']['$lte'] = query.ratingMax;
    }
    return filter;
  }

  async getAllInfluencers(dto: GetUserPublicrofileDto) {
    try {
      const query = {};
      const filter = this.buildProfileSearchFilter('');
      const influencers = this.userRepo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.influencerProfile', 'influencerProfile')
        .where('influencerProfile.userId IS NOT NULL')
        .limit(parseInt(dto.limit));

      Object.entries(filter).forEach(([key, value]) => {
        influencers.andWhere(`${key} = :${key.replace('.', '_')}`, {
          [key.replace('.', '_')]: value,
        });
      });

      const [rec, counts] = await influencers.getManyAndCount();

      return { data: rec, count: counts };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getInflucerPublicProfile(userId: string) {
    try {
      const user = await this.userRepo.findOne({
        where: { userId },
        relations: ['influencerProfile'],
      });
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateUserProfile() {}
  async findInfluencerProfileByUserId(userId: string) {
    return await this.influencerRepo.findOne({ where: { userId } });
  }

  async saveInfluencerProfile(profile: InfluencerProfile) {
    return await this.influencerRepo.save(profile);
  }
}
