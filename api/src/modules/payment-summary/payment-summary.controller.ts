import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  PaymentSummary,
  PaymentSummaryService,
} from './payment-summary.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';

@Controller('payment-summary')
@UseGuards(JwtAuthGuard)
export class PaymentSummaryController {
  constructor(private readonly paymentSummaryService: PaymentSummaryService) {}

  @Get()
  getPaymentSummary(@User('id') userId: string): Promise<PaymentSummary> {
    return this.paymentSummaryService.getPaymentSummary(userId);
  }
}
