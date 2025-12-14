import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { Product } from '../entities/product.entity';
import { ProductsService } from '../service/product.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { JwtGuard } from 'src/components/auth/guards/jwt.guard';
import { SuccessResponse } from 'src/shared/utils/api-response';
import { SUCCESS_MESSAGES } from 'src/shared/utils/success.utils';

@ApiTags('Product Management')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Req() req: ProfileRequestOptions) {
    const result = await this.productsService.getAllProducts(req);
    return SuccessResponse(result, 'Products fetched successfully');
  }

  @Get(':productId')
  async getProductById(
    @Req() req: ProfileRequestOptions,
    @Param('productId') productId: string,
  ): Promise<Product | null> {
    const result = await this.productsService.findOne(productId);
    return result;
  }

  @Post()
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtGuard)
  async create(
    @Body() product: CreateProductDto,
    @Req() req: ProfileRequestOptions,
  ) {
    const result = await this.productsService.create(product, req);
    return SuccessResponse(result, SUCCESS_MESSAGES.PRODUCT_CREATED);
  }

  @Patch(':productId')
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtGuard)
  async update(
    @Body() product: UpdateProductDto,
    @Param('productId') productId: string,
  ) {
    const result = await this.productsService.update(productId, product);
    return SuccessResponse(result, SUCCESS_MESSAGES.PRODUCT_UPDATED);
  }

  @Get('influencer/:influencerId')
  @ApiBearerAuth('Bearer')
  async getInfluencerProducts(
    @Req() req: ProfileRequestOptions,
    @Param('influencerId') influencerId: string,
  ) {
    const result = await this.productsService.getInfluencerProducts(
      req,
      influencerId,
    );
    return SuccessResponse(result, SUCCESS_MESSAGES.PRODUCT_UPDATED);
  }

  @Delete(':productId')
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtGuard)
  async deleteProduct(@Param('productId') productId: string) {
    const result = await this.productsService.deleteProduct(productId);
    return SuccessResponse(result, SUCCESS_MESSAGES.PRODUCT_DELETED);
  }
}
