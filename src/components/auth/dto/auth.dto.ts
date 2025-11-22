import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  isString,
  validate,
  ValidateIf,
} from 'class-validator';

export enum UserType {
  CUSTOMER = 'CUSTOMER',
  INFLUENCER = 'INFLUENCER',
  MODERATOR = 'MODERATOR',
}

export class RegisterDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsEnum(UserType)
  type: UserType;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === UserType.INFLUENCER)
  username: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class LoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateOrCreateInfluencerProfileDto {
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === UserType.INFLUENCER)
  address: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === UserType.INFLUENCER)
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === UserType.CUSTOMER)
  brandName: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === UserType.INFLUENCER)
  phoneNumber: string;

  @IsOptional()
  media: [];

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === UserType.INFLUENCER)
  @IsOptional()
  pays: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === UserType.INFLUENCER)
  city: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === UserType.INFLUENCER)
  bio: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === UserType.INFLUENCER)
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === UserType.INFLUENCER)
  @IsOptional()
  location: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === UserType.INFLUENCER)
  @IsOptional()
  subCategoryId: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === UserType.INFLUENCER)
  username: string;
}

export class SocialLoginDto {
  @IsEnum(UserType)
  state: UserType;
}
