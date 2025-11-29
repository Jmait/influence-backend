import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class ReviewDto {
  @IsNotEmpty()
  @IsUUID()
  influencerId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  rating: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class ProductReviewDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  rating: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
