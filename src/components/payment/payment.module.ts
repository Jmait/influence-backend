import { Module } from '@nestjs/common';
import { PaymentService } from './service/payment.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
