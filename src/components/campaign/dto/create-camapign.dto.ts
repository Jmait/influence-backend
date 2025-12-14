import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  numberOfDeliverables: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  duration: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  numberOfRevisions: number;

  @IsNotEmpty()
  @IsString()
  categoryId: string;
}

export class UpdateCampaignDto extends PartialType(CreateServiceDto) {}
