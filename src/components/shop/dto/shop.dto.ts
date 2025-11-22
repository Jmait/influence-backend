import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShopDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  logo?: string;

  @IsString()
  @IsNotEmpty()
  categoryId?: string;

  @IsString()
  @IsNotEmpty()
  coverImage?: string;
}
