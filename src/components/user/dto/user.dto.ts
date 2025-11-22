import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetUserProfileDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class GetUserPublicrofileDto {
  @IsString()
  @IsNotEmpty()
  limit: string;
}

export interface SocialMediaPlatform {
  handle: string;
  followers: number;
}

export interface SocialMedia {
  userId: string;
  platform: string;
  instagram?: SocialMediaPlatform;
  youtube?: SocialMediaPlatform;
  twitter?: SocialMediaPlatform;
  tiktok?: SocialMediaPlatform;
}
