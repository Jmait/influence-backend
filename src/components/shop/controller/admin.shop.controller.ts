import { Controller, Delete, Get, Param, Put, Req } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ShopService } from '../service/shop.service';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';

@ApiTags('Admin Boutique Management')
@Controller('admin/shop')
export class AdminShopManagementController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all shops',
    description: 'Retrieve all shops including deleted and suspended ones',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search query for shop name',
  })
  async getShops(@Req() req: ProfileRequestOptions) {
    return await this.shopService.getShopsForAdmin(req);
  }

  @Put(':shopId/suspend')
  @ApiOperation({
    summary: 'Suspend or unsuspend a shop',
    description:
      'Toggle shop suspension status. If shop is suspended, it will be unsuspended and vice versa',
  })
  @ApiParam({ name: 'shopId', description: 'Shop ID' })
  async suspendShop(@Param('shopId') shopId: string) {
    return await this.shopService.suspendShop(shopId);
  }

  @Delete(':shopId')
  @ApiOperation({
    summary: 'Delete a shop permanently',
    description:
      'Permanently delete a shop and its associated images from the system',
  })
  @ApiParam({ name: 'shopId', description: 'Shop ID' })
  async deleteShop(@Param('shopId') shopId: string) {
    return await this.shopService.deleteShopPermanently(shopId);
  }
}
