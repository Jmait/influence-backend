import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateShopDto,
  ShopImageUploadDto,
  UpdateShopDto,
} from '../dto/shop.dto';
import { Repository } from 'typeorm';
import { Shop } from '../entity/shop.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { SHOP_NOT_FOUND } from 'src/shared/utils/error.utils';
import { StorageService } from 'src/components/storage/storage.service';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
    private readonly storageService: StorageService,
  ) {}

  async getAllShops(options: ProfileRequestOptions) {
    try {
      let shopsEntity = this.shopRepository
        .createQueryBuilder('shop')
        .leftJoin('shop.products', 'product')
        .leftJoinAndSelect('shop.influencer', 'influencer')
        .loadRelationCountAndMap('shop.productCount', 'shop.products')
        .where('shop.deletedAt IS NULL');
      if (options.query.q) {
        shopsEntity = shopsEntity.andWhere('shop.name ILIKE :name', {
          name: `%${options.query.q}%`,
        });
      }
      const [shops, count] = await shopsEntity.getManyAndCount();
      return { shops, count };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getShopDetails(id: string) {
    try {
      const shop = await this.shopRepository.findOne({
        where: { shopId: id },
      });
      if (!shop) {
        throw new BadRequestException(SHOP_NOT_FOUND);
      }
      console.log(shop);
      return shop;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createShop(
    shopData: CreateShopDto,
    req: ProfileRequestOptions,
    files: Express.Multer.File[],
  ): Promise<Shop> {
    try {
      const profileId = req.user.influencerProfileId;
      const shop = this.shopRepository.create({
        ...shopData,
        location: shopData.location
          ? {
              name: shopData.location.locationName,
              lat: shopData.location.locationLat,
              lng: shopData.location.locationLng,
            }
          : undefined,
        influencerId: req.user.influencerProfileId,
      });
      const newShop = await this.shopRepository.save(shop);

      const imageFields = ['coverImage', 'shopLogo'] as const;
      const images: ShopImageUploadDto = {};
      for (const field of imageFields) {
        const file = this.storageService.getFileByField(field, files);
        if (file) {
          // Upload the file and get the URL
          const fileUrl = (
            await this.storageService.uploadFile(file.buffer, {
              userId: profileId,
              service: 'shop',
              folder: 'shops-images',
              file_name: shop.shopId,
              content_type: file.mimetype,
            })
          ).file_url;
          images[field] = fileUrl;
          console.log(`Uploaded image for ${field}: ${fileUrl}`);
        }
      }
      await this.shopRepository.update(newShop.shopId, {
        coverImage: images.coverImage,
        logo: images.shopLogo,
      });
      return (
        (await this.shopRepository.findOne({
          where: { shopId: newShop.shopId },
        })) ?? newShop
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getInfluencerShops(
    influencerId: string,
    options: ProfileRequestOptions,
  ) {
    try {
      let shops = await this.shopRepository
        .createQueryBuilder('shop')
        .leftJoin('shop.products', 'product')
        .leftJoinAndSelect('shop.influencer', 'influencer')
        .loadRelationCountAndMap('shop.productCount', 'shop.products')
        .where('shop.influencerId = :influencerId', { influencerId })
        .andWhere('shop.deletedAt IS NULL');
      if (options.query.q) {
        shops = shops.andWhere('shop.name ILIKE :name', {
          name: `%${options.query.q}%`,
        });
      }
      const [totalRecords, count] = await shops.getManyAndCount();
      return { totalRecords, count };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateShop(
    shopId: string,
    shopData: UpdateShopDto,
    files: Express.Multer.File[],
    req: ProfileRequestOptions,
  ) {
    try {
      const shop = await this.shopRepository.findOne({
        where: { shopId },
      });
      if (!shop) {
        throw new BadRequestException(SHOP_NOT_FOUND);
      }
      const profileId = req.user.influencerProfileId;

      const imageFields = ['coverImage', 'shopLogo'] as const;
      let images: ShopImageUploadDto = {};
      for (const field of imageFields) {
        const file = this.storageService.getFileByField(field, files);

        if (file) {
          const fileUrl = (
            await this.storageService.uploadPublicFiles(file.buffer, {
              userId: profileId,
              service: 'shop',
              folder: 'shops-images',
              file_name: `${file.originalname}-${shop.shopId}`,
              content_type: file.mimetype,
            })
          ).file_url;
          images[field] = fileUrl;

          const existingImageKey = this.storageService.extractS3Key(
            field === 'coverImage' ? shop.coverImage : shop.logo,
          );
          if (existingImageKey) {
            await this.storageService.deleteFile(existingImageKey);
          }
        }
      }

      await this.shopRepository.update(shopId, {
        ...shopData,
        coverImage: images.coverImage,
        logo: images.shopLogo,
        location: {
          name: shopData.location?.locationName ?? '',
          lat: shopData.location?.locationLat || 0,
          lng: shopData.location?.locationLng || 0,
        },
      });
      return await this.shopRepository.findOne({
        where: { shopId },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.mnessage);
    }
  }

  async deleteShop(shopId: string) {
    try {
      const shop = await this.shopRepository.findOne({
        where: { shopId },
      });
      if (!shop) {
        throw new BadRequestException('Shop not found');
      }
      await this.shopRepository.update(shopId, { deletedAt: new Date() });
      return { message: 'Shop deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
