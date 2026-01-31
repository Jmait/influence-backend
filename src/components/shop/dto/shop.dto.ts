import { PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class Location {
  @IsString()
  @IsNotEmpty()
  locationName: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  locationLat: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  locationLng: number;
}
export class CreateShopDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  categoryId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Location)
  location?: Location;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export interface ShopImageUploadDto {
  coverImage?: string;
  shopLogo?: string;
}

export class UpdateShopDto extends PartialType(CreateShopDto) {}
