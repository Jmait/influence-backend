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

@ApiTags('Product Management')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Req() req: ProfileRequestOptions,
  ): Promise<{ records: Product[]; counts: number }> {
    return this.productsService.findAll(req);
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
  ): Promise<Product | null> {
    return this.productsService.create(product, req);
  }

  @Patch(':productId')
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtGuard)
  async update(
    @Body() product: UpdateProductDto,
    @Param('productId') productId: string,
  ) {
    const result = await this.productsService.update(productId, product);
    return { result, message: 'Product updated successfully' };
  }

  @Delete(':productId')
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtGuard)
  async deleteProduct(@Param('productId') productId: string) {
    const result = await this.productsService.deleteProduct(productId);
    return { result, message: 'Product deleted successfully' };
  }
}
