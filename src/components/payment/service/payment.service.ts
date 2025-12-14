import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Stripe from 'stripe';
import { InitiatePaymentInterface } from '../interface/payment.interface';
import { PAYMENT_INITIALIZATION_FAILED } from 'src/shared/utils/error.utils';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private logger = new Logger(PaymentService.name);
  constructor(private readonly configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error(
        'STRIPE_SECRET_KEY is not defined in environment variables',
      );
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover',
    });
  }

  async initiatePaymentCollection(body: InitiatePaymentInterface) {
    try {
      const { amount, currency, paymentMethod, metadata, email } = body;
      if (paymentMethod === 'CARD') {
        const paymentIntent = await this.stripe.paymentIntents.create({
          amount: Math.round(Number(amount) * 100),
          currency: currency,
          receipt_email: email,
          metadata: metadata,
        });
        const clientSecret = paymentIntent.client_secret;

        return clientSecret;
      }
    } catch (error) {
      this.logger.error(
        `Error initiating payment collection: ${error.message}`,
      );
      throw new BadRequestException(PAYMENT_INITIALIZATION_FAILED);
    }
  }
}
