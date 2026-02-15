import { Controller, Get } from '@nestjs/common';
import {
  PaymentSummary,
  PaymentSummaryService,
} from './payment-summary.service';

@Controller('payment-summary')
export class PaymentSummaryController {
  constructor(private readonly paymentSummaryService: PaymentSummaryService) {}

  @Get()
  getPaymentSummary(): Promise<PaymentSummary> {
    return this.paymentSummaryService.getPaymentSummary();
  }
}
