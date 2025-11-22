import { Controller, Get, Post, Body } from '@nestjs/common';

import { Product } from '../entities/product.entity';
import { ProductsService } from '../service/products.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product Management')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Post()
  async create(@Body() product: Product): Promise<Product> {
    return this.productsService.create(product);
  }
}
