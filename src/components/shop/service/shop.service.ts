import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateShopDto } from '../dto/shop.dto';
import { Repository } from 'typeorm';
import { Shop } from '../entity/shop.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileRequestOptions } from 'src/shared/interface/shared.interface';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>, // Replace 'any' with actual repository type
  ) {}
  // Example method to get all shops
  async getAllShops(): Promise<Shop[]> {
    try {
      const shops = await this.shopRepository.find();
      return shops;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Example method to get a shop by ID
  async getShopById(id: string): Promise<any | null> {
    // TODO: Implement actual logic to fetch a shop by ID
    return null;
  }

  async createShop(
    shopData: CreateShopDto,
    req: ProfileRequestOptions,
  ): Promise<any> {
    try {
      console.log('Request user:', req.user);
      console.log('Creating shop with data:', shopData);

      const shop = this.shopRepository.create({
        ...shopData,
        influencerId: req.user.influencerProfileId,
      });
      return await this.shopRepository.save(shop);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getInfluencerShops(influencerId: string): Promise<Shop[]> {
    try {
      const shops = await this.shopRepository
        .createQueryBuilder('shop')
        .leftJoin('shop.products', 'product')
        .leftJoinAndSelect('shop.influencer', 'influencer')
        .loadRelationCountAndMap('shop.productCount', 'shop.products')
        .where('shop.influencerId = :influencerId', { influencerId })
        .getMany();

      console.log('Found shops for influencer:', shops);
      return shops;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Example method to update a shop
  async updateShop(id: string, shopData: any): Promise<any | null> {
    // TODO: Implement actual logic to update a shop
    return null;
  }

  // Example method to delete a shop
  async deleteShop(id: string): Promise<boolean> {
    // TODO: Implement actual logic to delete a shop
    return false;
  }
}
