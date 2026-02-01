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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateShopDto, UpdateShopDto } from '../dto/shop.dto';
import { ShopService } from '../service/shop.service';
import { JwtGuard } from 'src/components/auth/guards/jwt.guard';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { SuccessResponse } from 'src/shared/utils/api-response';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Boutique Management')
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}
  @Get()
  async getAllShops(@Req() req: ProfileRequestOptions) {
    const result = await this.shopService.getAllShops(req);
    return SuccessResponse(result, 'All shops fetched successfully');
  }

  @Get(':shopId')
  async getShopDetails(@Param('shopId') shopId: string) {
    const result = await this.shopService.getShopDetails(shopId);
    console.log(result, 'result');
    return SuccessResponse(result, 'Shop details fetched successfully');
  }

  @ApiBearerAuth('Bearer')
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  @UseGuards(JwtGuard)
  async create(
    @Body() createShopDto: CreateShopDto,
    @Req() req: ProfileRequestOptions,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const result = await this.shopService.createShop(createShopDto, req, files);
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
  @UseInterceptors(AnyFilesInterceptor())
  @ApiBearerAuth('Bearer')
  async update(
    @Param('shopId') id: string,
    @Body() updateShopDto: UpdateShopDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: ProfileRequestOptions,
  ) {
    const result = await this.shopService.updateShop(
      id,
      updateShopDto,
      files,
      req,
    );
    return SuccessResponse(result, 'Shop updated successfully');
  }

  @Delete(':shopId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('Bearer')
  async delete(@Param('shopId') id: string) {
    const result = await this.shopService.deleteShop(id);
    return SuccessResponse(result, 'Shop deleted successfully');
  }
}
