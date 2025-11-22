import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Influencer Service Management')
@Controller('influencer-service')
export class InfluencerServiceController {
  @Get()
  async getServiceList() {
    // Implementation for fetching influencer services
  }

  @Get(':serviceId')
  async getServiceDetails() {
    // Implementation for fetching details of a specific service
  }

  @Get('categories')
  async getServiceCategories() {
    // Implementation for fetching service categories
  }

  @Get('categories/:categoryId/services')
  async getServicesByCategory() {
    // Implementation for fetching services by category
  }
}
