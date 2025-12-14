export class InitiatePaymentInterface {
  amount: number;
  currency: string;
  email: string;
  paymentMethod: string;
  metadata?: Record<string, any>;
}
