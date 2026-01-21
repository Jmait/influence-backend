import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateShopDto, UpdateShopDto } from '../dto/shop.dto';
import { Repository } from 'typeorm';
import { Shop } from '../entity/shop.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { SHOP_NOT_FOUND } from 'src/shared/utils/error.utils';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>, // Replace 'any' with actual repository type
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
      return shop;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createShop(
    shopData: CreateShopDto,
    req: ProfileRequestOptions,
  ): Promise<Shop> {
    try {
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
      const shopsdata = await this.shopRepository.save(shop);

      return shopsdata;
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

  async updateShop(shopId: string, shopData: UpdateShopDto) {
    try {
      const shop = await this.shopRepository.findOne({
        where: { shopId },
      });
      if (!shop) {
        throw new BadRequestException(SHOP_NOT_FOUND);
      }

      await this.shopRepository.update(shopId, {
        ...shopData,
        location: shopData.location
          ? {
              name: shopData.location.locationName,
              lat: shopData.location.locationLat,
              lng: shopData.location.locationLng,
            }
          : undefined,
      });
      return await this.shopRepository.findOne({
        where: { shopId },
      });
    } catch (error) {
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
