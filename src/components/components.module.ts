import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InfluencerModule } from './influencers/influencer.module';
import { InfluencerServiceModule } from './influencer-service/influencer-service.module';
import { ShopModule } from './shop/shop.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { InfluencerCategoryModule } from './influencer-category/influencer-category.module';
import { ShippingAddressModule } from './shipping/shipping.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    InfluencerModule,
    InfluencerServiceModule,
    ShopModule,
    ReviewsModule,
    ProductsModule,
    OrdersModule,
    CustomersModule,
    ShippingAddressModule,
    InfluencerCategoryModule,
  ],
})
export class ComponentsModule {}
