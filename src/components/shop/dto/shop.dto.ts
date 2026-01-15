import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShopDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  categoryId?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  location: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateShopDto extends PartialType(CreateShopDto) {}
