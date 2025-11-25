import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';

import { Product } from '../entities/product.entity';
import { ProductsService } from '../service/product.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from '../dto/product.dto';
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

  @Post()
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtGuard)
  async create(
    @Body() product: CreateProductDto,
    @Req() req: ProfileRequestOptions,
  ): Promise<Product> {
    return this.productsService.create(product, req);
  }
}
