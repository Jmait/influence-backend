import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class Location {
  @IsString()
  @IsNotEmpty()
  locationName: string;

  @IsNumber()
  locationLat: number;

  @IsNumber()
  locationLng: number;
}
export class CreateShopDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  categoryId?: string;

  @IsString()
  @IsOptional()
  @Type(() => Location)
  location: Location;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateShopDto extends PartialType(CreateShopDto) {}
