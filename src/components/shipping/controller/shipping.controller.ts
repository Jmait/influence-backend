import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ShippingService } from '../service/shipping.service';
import { SuccessResponse } from 'src/shared/utils/api-response';
import {
  DeliverAddressDto,
  UpdateDeliverAddressDto,
} from '../dto/shipping.dto';
import { JwtGuard } from 'src/components/auth/guards/jwt.guard';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { SUCCESS_MESSAGES } from 'src/shared/utils/success.utils';

@ApiTags('Shipping Management')
@ApiBearerAuth('Bearer')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}
  @Post()
  @UseGuards(JwtGuard)
  async asuaddShippingAddress(
    @Body() body: DeliverAddressDto,
    @Req() req: ProfileRequestOptions,
  ) {
    const address = await this.shippingService.addShippingAddress(
      body,
      req.user.userId,
    );
    return SuccessResponse(address, SUCCESS_MESSAGES.SHIPPING_ADDRESS_ADDED);
  }

  @Get()
  @UseGuards(JwtGuard)
  async getShippingAddresses(@Req() req: ProfileRequestOptions) {
    const userId = req.user.userId;
    const address = await this.shippingService.getShippingAddresses(userId);
    return SuccessResponse(address, SUCCESS_MESSAGES.SHIPPING_ADDRESS_ADDED);
  }

  @Patch(':addressId')
  @UseGuards(JwtGuard)
  async updateShippingAddress(
    @Body() body: UpdateDeliverAddressDto,
    @Param('addressId') addressId: string,
  ) {
    const address = await this.shippingService.updateShippingAddress(
      body,
      addressId,
    );
    return SuccessResponse(address, SUCCESS_MESSAGES.SHIPPING_ADDRESS_UPDATED);
  }

  @Delete(':addressId')
  @UseGuards(JwtGuard)
  async deleteShippingAddress(@Param('addressId') addressId: string) {
    const result = await this.shippingService.deleteShippingAddress(addressId);
    return SuccessResponse(result, SUCCESS_MESSAGES.SHIPPING_ADDRESS_DELETED);
  }
}
