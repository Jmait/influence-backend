import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsJSON,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { DeliverAddressDto } from 'src/components/shipping/dto/shipping.dto';

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

export class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsPositive()
  price: number;

  @IsPositive()
  quantity: number;
}
