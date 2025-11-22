import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Shop Management')
@Controller('shop')
export class ShopController {
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

  @Post()
  create(@Body() createShopDto: any) {
    // Create a new shop
    return 'This action adds a new shop';
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
