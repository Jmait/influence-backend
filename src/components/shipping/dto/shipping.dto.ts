import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class DeliverAddressDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  addressLine1: string;

  @IsString()
  postalCode: string;

  @IsBoolean()
  isBillingAddress: boolean;

  @IsString()
  @IsOptional()
  additionalAddress: string;

  @IsString()
  city: string;
}

export class UpdateDeliverAddressDto extends PartialType(DeliverAddressDto) {}
