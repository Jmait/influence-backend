import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CustomersService } from '../service/customers.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/components/auth/guards/jwt.guard';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { SuccessResponse } from 'src/shared/utils/api-response';

@ApiTags('Customer Management')
@ApiBearerAuth('Bearer')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getCustomers(@Req() req: ProfileRequestOptions) {
    const customers = await this.customersService.getInfluencerCustomers(req);
    return SuccessResponse(
      customers,
      'Influencer customers fetched successfully',
    );
  }
}
