import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsJSON,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { OrderItemType } from 'src/shared/enums/enum';

export class CreateOrderDto {
  @IsUUID()
  influencerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  shippingAddressId: string;
}

export class OrderListFilterDto {
  @IsOptional()
  @ApiPropertyOptional()
  status?: string[];

  @IsOptional()
  @ApiPropertyOptional()
  type: string;
}

export class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsEnum(OrderItemType)
  type: OrderItemType;

  @IsString()
  name: string;

  @IsPositive()
  price: number;

  @IsPositive()
  quantity: number;
}
