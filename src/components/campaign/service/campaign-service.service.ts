import { BadRequestException, Body, Inject, Post } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Campaigns } from '../entities/campaign.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { CampaignCategory } from '../entities/campaign_category.entity';
import {
  CreateServiceDto,
  UpdateCampaignDto,
} from '../dto/create-camapign.dto';

export class CampaignService {
  constructor(
    @InjectRepository(Campaigns)
    private readonly serviceRepository: Repository<Campaigns>,

    @InjectRepository(CampaignCategory)
    private readonly serviceCategory: Repository<CampaignCategory>,
  ) {}

  async CreateCampaign(
    createServiceDto: CreateServiceDto,
    influencerId: string,
  ) {
    try {
      const service = this.serviceRepository.create({
        price: createServiceDto.price,
        numberOfDeliverables: createServiceDto.numberOfDeliverables,
        duration: createServiceDto.duration,
        numberOfRevisions: createServiceDto.numberOfRevisions,
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

  async updateCampaign(body: UpdateCampaignDto, campaignId: string) {
    try {
      const campaign = await this.serviceRepository.findOne({
        where: { serviceId: campaignId },
      });
      if (!campaign) {
        throw new BadRequestException('Campaign not found');
      }
      await this.serviceRepository.update(campaignId, body);
      return await this.serviceRepository.findOne({
        where: { serviceId: campaignId },
      });
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
      const { limit, offset } = pagination;
      const services = this.serviceRepository
        .createQueryBuilder('service')
        .where('service.influencerId = :influencerId', { influencerId })
        .take(limit)
        .skip(offset);
      if (query.categoryId) {
        services.andWhere('service.categoryId = :categoryId', {
          categoryId: query.categoryId,
        });
      }
      if (query.q) {
        services.andWhere('service.title ILIKE :title', {
          title: `%${query.q}%`,
        });
      }
      const [records, counts] = await services.getManyAndCount();
      return { records, counts };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteCampaign(campaignId: string) {
    try {
      const campaign = this.serviceRepository.findOne({
        where: { serviceId: campaignId },
      });
      if (!campaign) {
        throw new BadRequestException('Campaign not found');
      }
      return this.serviceRepository.delete({ serviceId: campaignId });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getCampaignDetails(campaignId: string) {
    try {
      const campaign = await this.serviceRepository.findOne({
        where: { serviceId: campaignId },
      });
      if (!campaign) {
        throw new BadRequestException('Campaign not found');
      }
      return campaign;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

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
