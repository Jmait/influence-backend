import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersController } from './controller/orders.controller';
import { OrdersService } from './service/orders.service';
import { OrderItem } from './entities/order-items.entity';
import { Product } from '../products/entities/product.entity';
import { PaymentModule } from '../payment/payment.module';
import { Customer } from '../customers/entities/customer.entity';
import { User } from '../user/entities/user.entity';
import { Campaigns } from '../campaign/entities/campaign.entity';
import { InfluencerProfile } from '../influencers/entities/influencer.entity';
import { AdminOrderManagementController } from './controller/order.admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Product,
      Customer,
      User,
      Campaigns,
      InfluencerProfile,
    ]),
    PaymentModule,
  ],
  controllers: [OrdersController, AdminOrderManagementController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
