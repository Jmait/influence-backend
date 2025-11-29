import { BadRequestException, Body, Inject, Post } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InfluencerService } from '../entities/influencer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { InfluncerServiceCategory } from '../entities/service_category.entity';
import { CreateServiceDto } from '../dto/create-service.dto';

export class InfluncerServiceAsproduct {
  constructor(
    @InjectRepository(InfluencerService)
    private readonly serviceRepository: Repository<InfluencerService>,

    @InjectRepository(InfluncerServiceCategory)
    private readonly serviceCategory: Repository<InfluncerServiceCategory>,
  ) {}

  @Post()
  async CreateService(
    @Body() createServiceDto: CreateServiceDto,
    influencerId: string,
  ) {
    try {
      const existing = await this.serviceRepository
        .createQueryBuilder('service')
        .where('service.title ILIKE :name', { name: createServiceDto.name })
        .andWhere('service.influencerId = :influencerId', { influencerId })
        .getOne();
      if (existing) {
        throw new BadRequestException(
          'Service with this name already exists for the influencer',
        );
      }
      const service = this.serviceRepository.create({
        price: createServiceDto.price,
        description: createServiceDto.description,
        serviceCategoryId: createServiceDto.categoryId,
        title: createServiceDto.name,
        influencerId,
      });
      return await this.serviceRepository.save(service);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getInfluencerServices(
    options: ProfileRequestOptions,
    influencerId: string,
  ) {
    try {
      const { pagination, query } = options;
      const { limit, page } = pagination;
      const services = this.serviceRepository
        .createQueryBuilder('service')
        .where('service.influencerId = :influencerId', { influencerId })
        .take(limit)
        .skip((page - 1) * limit);
      if (query.categoryId) {
        services.andWhere('service.categoryId = :categoryId', {
          categoryId: query.categoryId,
        });
      }
      const [records, counts] = await services.getManyAndCount();
      return { records, counts };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  updateInfluencerService() {}

  deleteInfluencerService() {}

  async getServiceCategories() {
    try {
      const categories = this.serviceCategory.createQueryBuilder('category');
      const [records, counts] = await categories.getManyAndCount();
      return { records, counts };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
