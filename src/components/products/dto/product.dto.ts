import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  price: number;

  @IsString()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsOptional()
  shippingFee?: number;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  subCategoryId: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsArray()
  @IsOptional()
  variants: ProductVariantsDto[];

  @IsString()
  @IsUUID()
  shopId: string;
}

class ProductVariantsDto {
  @IsString()
  @IsNotEmpty()
  variantName: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}

class UpdateProductVariantsDto extends ProductVariantsDto {
  @IsString()
  @IsNotEmpty()
  variantId: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsArray()
  @IsOptional()
  variants?: UpdateProductVariantsDto[];
}
