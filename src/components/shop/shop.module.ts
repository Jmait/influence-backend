import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopService } from './service/shop.service';
import { Shop } from './entity/shop.entity';
import { ShopController } from './controller/shop.controller';
import { StorageModule } from '../storage';

@Module({
  imports: [TypeOrmModule.forFeature([Shop]), StorageModule],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
