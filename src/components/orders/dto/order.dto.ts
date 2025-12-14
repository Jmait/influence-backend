import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  influencerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsPositive()
  price: number;

  @IsPositive()
  quantity: number;
}

export class DeliverAddressDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  addressLine1: string;

  @IsString()
  @IsOptional()
  additionalAddress: string;

  @IsString()
  city: string;
}
