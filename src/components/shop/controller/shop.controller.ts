import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateShopDto } from '../dto/shop.dto';
import { ShopService } from '../service/shop.service';
import { JwtGuard } from 'src/components/auth/guards/jwt.guard';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';

@ApiTags('Shop Management')
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}
  @Get()
  findAll() {
    // Return all shops
    return 'This action returns all shops';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Return a single shop by id
    return `This action returns shop #${id}`;
  }

  @ApiBearerAuth('Bearer')
  @Post()
  @UseGuards(JwtGuard)
  create(
    @Body() createShopDto: CreateShopDto,
    @Req() req: ProfileRequestOptions,
  ) {
    const result = this.shopService.createShop(createShopDto, req);
    return result;
  }

  @Get('influencer/:influencerId')
  async getInfluencerShops(@Param('influencerId') influencerId: string) {
    const result = await this.shopService.getInfluencerShops(influencerId);
    return { result };
  }

  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateShopDto: any) {
    // Update a shop by id
    return `This action updates shop #${id}`;
  }

  @Post('delete/:id')
  delete(@Param('id') id: string) {
    // Delete a shop by id
    return `This action deletes shop #${id}`;
  }
}
