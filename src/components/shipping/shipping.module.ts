import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingAddress } from './entities/shipping.entity';
import { ShippingService } from './service/shipping.service';
import { ShippingController } from './controller/shipping.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingAddress])],
  controllers: [ShippingController],
  providers: [ShippingService],
  exports: [],
})
export class ShippingAddressModule {}
