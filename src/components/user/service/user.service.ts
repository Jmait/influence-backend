import { BadRequestException, Injectable } from '@nestjs/common';
import {
  RegisterDto,
  UpdateOrCreateInfluencerProfileDto,
  UserType,
} from 'src/components/auth/dto/auth.dto';
import { User } from '../entities/user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import * as argon2 from 'argon2';
import { InfluencerProfile } from 'src/components/influencers/entities/influencer.entity';
import {
  GetUserProfileDto,
  GetUserPublicrofileDto,
  SocialMedia,
} from '../dto/user.dto';
import { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { StorageService } from 'src/components/storage/storage.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(InfluencerProfile)
    private readonly influencerRepo: Repository<InfluencerProfile>,

    private readonly storageService: StorageService,
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
    files: Express.Multer.File[],
  ) {
    try {
      if (user.type === UserType.INFLUENCER) {
        const existingProfile = await this.influencerRepo.findOne({
          where: { userId: user.userId },
        });
        const profileId = user.userId;

        let uploadedImages: string[] = [];
        if (files && files.length > 0) {
          const { uploadedImages: images } = await this.uploadProfileImages(
            files,
            existingProfile,
            profileId,
          );
          uploadedImages = images;
        }

        let coverImage: string | null = null;
        if (files && files.length > 0) {
          coverImage = await this.uploadCoverImage(
            files,
            profileId,
            existingProfile,
          );
        }

        if (existingProfile) {
          Object.assign(existingProfile, {
            ...body,
            profileImages:
              uploadedImages.length > 0
                ? uploadedImages
                : existingProfile.profileImages,
            coverImage: coverImage || existingProfile.coverImage,
          });
          await this.influencerRepo.save(existingProfile);
          return await this.userRepo.findOne({
            where: { userId: user.userId },
            relations: ['influencerProfile'],
          });
        }
        const profile = this.influencerRepo.create({
          ...body,
          profileImages: uploadedImages,
          coverImage: coverImage || undefined,
          userId: user.userId,
        });
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

  private async uploadProfileImages(
    files: Express.Multer.File[],
    existingProfile: InfluencerProfile | null,
    profileId: string,
  ): Promise<{ uploadedImages: string[] }> {
    const uploadedImages: string[] = [];
    if (!files || files.length === 0) {
      return { uploadedImages };
    }
    for (let i = 0; i < files.length; i++) {
      const profileImagesFile = this.storageService.getFileByField(
        `profileImages_${i}`,
        files,
      );

      if (profileImagesFile) {
        console.log('Uploaded images:', uploadedImages);
        const fileUrl = (
          await this.storageService.uploadPublicFiles(
            profileImagesFile.buffer,
            {
              userId: profileId,
              service: 'profiles',
              folder: 'profile-images',
              file_name: `${profileImagesFile.originalname}-${profileId}`,
              content_type: profileImagesFile.mimetype,
            },
          )
        ).file_url;
        uploadedImages.push(fileUrl);
      }
      if (uploadedImages.length > 0) {
        const newImageKey = this.storageService.extractS3Key(uploadedImages[i]);
        if (existingProfile?.profileImages) {
          const existingImageKey = this.storageService.extractS3Key(
            existingProfile?.profileImages[i],
          );
          if (existingImageKey && existingImageKey != newImageKey) {
            await this.storageService.deleteFile(existingImageKey);
          }
        }
      }
    }

    return { uploadedImages };
  }

  private async uploadCoverImage(
    files: Express.Multer.File[],
    profileId: string,
    existingProfile: InfluencerProfile | null,
  ) {
    let coverImage: string | null = null;
    if (!files || files.length === 0) {
      return coverImage;
    }
    const coverImageFile = this.storageService.getFileByField(
      'coverImage',
      files,
    );

    if (coverImageFile) {
      const fileUrl = (
        await this.storageService.uploadPublicFiles(coverImageFile.buffer, {
          userId: profileId,
          service: 'profiles',
          folder: 'profile-images',
          file_name: `${coverImageFile.originalname}-${profileId}`,
          content_type: coverImageFile.mimetype,
        })
      ).file_url;
      coverImage = fileUrl;
    }

    if (existingProfile) {
      const newImageKey = this.storageService.extractS3Key(
        existingProfile?.coverImage,
      );
      if (existingProfile?.profileImages) {
        const existingImageKey = this.storageService.extractS3Key(
          existingProfile?.coverImage,
        );
        if (existingImageKey && existingImageKey != newImageKey) {
          await this.storageService.deleteFile(existingImageKey);
        }
      }
    }

    return coverImage;
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
    return await this.userRepo.findOne({
      where: { email },
      relations: ['influencerProfile'],
    });
  }

  buildProfileSearchFilter(query: any) {
    const where: { sql: string; params: any }[] = [];

    // Username
    if (query.username) {
      where.push({
        sql: 'profile.username ILIKE :username',
        params: { username: `%${query.username}%` },
      });
    }

    // First name
    if (query.firstName) {
      where.push({
        sql: 'user.firstName ILIKE :firstName',
        params: { firstName: `%${query.firstName}%` },
      });
    }

    // Last name
    if (query.lastName) {
      where.push({
        sql: 'user.lastName ILIKE :lastName',
        params: { lastName: `%${query.lastName}%` },
      });
    }

    // Single category
    if (query.categoryId) {
      where.push({
        sql: 'profile.categoryId = :categoryId',
        params: { categoryId: query.categoryId },
      });
    }

    // MULTIPLE categories
    if (query.categoryIds?.length > 0) {
      where.push({
        sql: 'profile.categoryId IN (:...categoryIds)',
        params: { categoryIds: query.categoryIds },
      });
    }

    // Single subcategory
    if (query.subCategoryId) {
      where.push({
        sql: 'profile.subCategoryId = :subCategoryId',
        params: { subCategoryId: query.subCategoryId },
      });
    }

    // MULTIPLE subcategories
    if (query.subCategoryIds?.length > 0) {
      where.push({
        sql: 'profile.subCategoryId IN (:...subCategoryIds)',
        params: { subCategoryIds: query.subCategoryIds },
      });
    }

    // Location
    if (query.location) {
      where.push({
        sql: 'profile.location ILIKE :location',
        params: { location: `%${query.location}%` },
      });
    }

    // Verified
    if (typeof query.verified === 'boolean') {
      where.push({
        sql: 'profile.verified = :verified',
        params: { verified: query.verified },
      });
    }

    // Followers range
    if (query.followersMin !== undefined) {
      where.push({
        sql: 'profile.totalFollowers >= :followersMin',
        params: { followersMin: query.followersMin },
      });
    }

    if (query.followersMax !== undefined) {
      where.push({
        sql: 'profile.totalFollowers <= :followersMax',
        params: { followersMax: query.followersMax },
      });
    }

    // Engagement rate range
    if (query.engagementMin !== undefined) {
      where.push({
        sql: 'profile.averageEngagement >= :engagementMin',
        params: { engagementMin: query.engagementMin },
      });
    }

    if (query.engagementMax !== undefined) {
      where.push({
        sql: 'profile.averageEngagement <= :engagementMax',
        params: { engagementMax: query.engagementMax },
      });
    }

    // Rating range
    if (query.ratingMin !== undefined) {
      where.push({
        sql: 'profile.rating >= :ratingMin',
        params: { ratingMin: query.ratingMin },
      });
    }

    if (query.ratingMax !== undefined) {
      where.push({
        sql: 'profile.rating <= :ratingMax',
        params: { ratingMax: query.ratingMax },
      });
    }

    return where;
  }

  applySorting(qb: SelectQueryBuilder<any>, sort?: string) {
    console.log('Applying sorting:', sort);
    switch (sort) {
      case 'newest':
        qb.orderBy('profile.createdAt', 'DESC');
        break;

      case 'oldest':
        qb.orderBy('profile.createdAt', 'ASC');
        break;

      case 'followers_desc':
        qb.orderBy('profile.totalFollowers', 'DESC');
        break;

      case 'followers_asc':
        qb.orderBy('profile.totalFollowers', 'ASC');
        break;

      case 'engagement_desc':
        qb.orderBy('profile.averageEngagement', 'DESC');
        break;

      case 'engagement_asc':
        qb.orderBy('profile.averageEngagement', 'ASC');
        break;

      case 'rating_desc':
        qb.orderBy('profile.rating', 'DESC');
        break;

      case 'rating_asc':
        qb.orderBy('profile.rating', 'ASC');
        break;

      case 'alphabetical':
        qb.orderBy('user.firstName', 'ASC');
        break;

      case 'random':
        qb.orderBy('RANDOM()');
        break;

      default:
        qb.orderBy('profile.createdAt', 'DESC');
    }
  }

  async getAllInfluencers(
    dto: GetUserPublicrofileDto,
    options: ProfileRequestOptions,
  ) {
    try {
      const { query, pagination } = options;
      const { offset, limit } = pagination;
      const filter = this.buildProfileSearchFilter(query);
      const influencers = this.userRepo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.influencerProfile', 'profile')
        .where('profile.userId IS NOT NULL')
        .take(limit)
        .skip(offset);

      if (query) {
        filter.forEach((filter) =>
          influencers.andWhere(filter.sql, filter.params),
        );
        if (query.sort) {
          this.applySorting(influencers, query.sort);
        } else {
          // Default sorting only if no sort specified
          // influencers.orderBy('user.createdAt', 'DESC');
        }
      } else {
        // Default sorting when no query
        // influencers.orderBy('user.createdAt', 'DESC');
      }

      const [rec, counts] = await influencers.getManyAndCount();

      return { data: rec, count: counts };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getInflucerPublicProfile(influencerId: string) {
    try {
      const user = await this.influencerRepo
        .createQueryBuilder('influencer')
        .leftJoinAndSelect('influencer.user', 'user')
        // .leftJoinAndSelect('influencer.category', 'category')
        // .leftJoinAndSelect('influencer.subCategory', 'subCategory')
        .leftJoinAndSelect('influencer.shops', 'shops')
        .where('influencer.influencerProfileId = :influencerId', {
          influencerId,
        })

        .getOne();
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
