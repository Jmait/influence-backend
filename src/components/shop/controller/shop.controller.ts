import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateShopDto, UpdateShopDto } from '../dto/shop.dto';
import { ShopService } from '../service/shop.service';
import { JwtGuard } from 'src/components/auth/guards/jwt.guard';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { SuccessResponse } from 'src/shared/utils/api-response';

@ApiTags('Boutique Management')
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}
  @Get()
  getAllShops(@Req() req: ProfileRequestOptions) {
    const result = this.shopService.getAllShops(req);
    return SuccessResponse(result, 'All shops fetched successfully');
  }

  @Get(':shopId')
  getShopDetails(@Param('shopId') shopId: string) {
    const result = this.shopService.getShopDetails(shopId);
    return SuccessResponse(result, 'Shop details fetched successfully');
  }

  @ApiBearerAuth('Bearer')
  @Post()
  @UseGuards(JwtGuard)
  create(
    @Body() createShopDto: CreateShopDto,
    @Req() req: ProfileRequestOptions,
  ) {
    const result = this.shopService.createShop(createShopDto, req);
    return SuccessResponse(result, 'Shop created successfully');
  }

  @Get('/influencer/:influencerId')
  async getInfluencerShops(
    @Param('influencerId') influencerId: string,
    @Req() req: ProfileRequestOptions,
  ) {
    const result = await this.shopService.getInfluencerShops(influencerId, req);
    return SuccessResponse(result, 'Influencer shops fetched successfully');
  }

  @Patch(':shopId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('Bearer')
  update(@Param('shopId') id: string, @Body() updateShopDto: UpdateShopDto) {
    const result = this.shopService.updateShop(id, updateShopDto);
    return SuccessResponse(result, 'Shop updated successfully');
  }

  @Delete(':shopId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('Bearer')
  delete(@Param('shopId') id: string) {
    const result = this.shopService.deleteShop(id);
    return SuccessResponse(result, 'Shop deleted successfully');
  }
}
