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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { Product } from '../entities/product.entity';
import { ProductsService } from '../service/product.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { JwtGuard } from 'src/components/auth/guards/jwt.guard';
import { SuccessResponse } from 'src/shared/utils/api-response';
import { SUCCESS_MESSAGES } from 'src/shared/utils/success.utils';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Product Management')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description:
      'Retrieve all products with filtering and sorting options. Supports search by name, filter by shop, category, price range, rating, and stock status',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search by product name',
  })
  @ApiQuery({
    name: 'shopId',
    required: false,
    description: 'Filter by shop ID',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'subCategoryId',
    required: false,
    description: 'Filter by subcategory ID',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    description: 'Minimum price filter',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    description: 'Maximum price filter',
  })
  @ApiQuery({
    name: 'minRating',
    required: false,
    description: 'Minimum rating filter',
  })
  @ApiQuery({
    name: 'inStock',
    required: false,
    description: 'Filter only in-stock products',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description:
      'Sort options: newest, price_asc, price_desc, rating_asc, rating_desc, alphabetical, quantity_asc, quantity_desc',
  })
  async findAll(@Req() req: ProfileRequestOptions) {
    const result = await this.productsService.getAllProducts(req);
    return SuccessResponse(result, 'Products fetched successfully');
  }

  @Get(':productId')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve a single product with its variants',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  async getProductById(
    @Req() req: ProfileRequestOptions,
    @Param('productId') productId: string,
  ): Promise<Product | null> {
    const result = await this.productsService.findOne(productId);
    return result;
  }

  @Post()
  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'Create a new product',
    description:
      'Create a new product with variants and images. Requires authentication',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @UseGuards(JwtGuard)
  async create(
    @Body() product: CreateProductDto,
    @Req() req: ProfileRequestOptions,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const result = await this.productsService.create(product, req, files);
    return SuccessResponse(result, SUCCESS_MESSAGES.PRODUCT_CREATED);
  }

  @Patch(':productId')
  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'Update a product',
    description: 'Update product details, variants, and images',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @UseGuards(JwtGuard)
  async update(
    @Body() product: UpdateProductDto,
    @Param('productId') productId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const result = await this.productsService.update(productId, product, files);
    return SuccessResponse(result, SUCCESS_MESSAGES.PRODUCT_UPDATED);
  }

  @Get('influencer/:influencerId')
  @ApiOperation({
    summary: 'Get products by influencer',
    description: 'Retrieve all products for a specific influencer',
  })
  @ApiParam({ name: 'influencerId', description: 'Influencer Profile ID' })
  @ApiBearerAuth('Bearer')
  async getInfluencerProducts(
    @Req() req: ProfileRequestOptions,
    @Param('influencerId') influencerId: string,
  ) {
    const result = await this.productsService.getInfluencerProducts(
      req,
      influencerId,
    );
    return SuccessResponse(result, 'Products fetched successfully');
  }

  @Delete(':productId')
  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Soft delete a product (sets deletedAt timestamp)',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @UseGuards(JwtGuard)
  async deleteProduct(@Param('productId') productId: string) {
    const result = await this.productsService.deleteProduct(productId);
    return SuccessResponse(result, SUCCESS_MESSAGES.PRODUCT_DELETED);
  }
}
