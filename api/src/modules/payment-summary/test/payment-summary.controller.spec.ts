import { Test, TestingModule } from '@nestjs/testing';
import { PaymentSummaryController } from '../payment-summary.controller';
import { PaymentSummaryService } from '../payment-summary.service';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('PaymentSummaryController', () => {
  let controller: PaymentSummaryController;
  let service: PaymentSummaryService;

  const mockPaymentSummary = {
    totalItems: 3,
    productCostCents: 4275,
    shippingCostCents: 499,
    totalCostBeforeTaxCents: 4774,
    taxCents: 477,
    totalCostCents: 5251,
  };

  const mockUserId = '1e5bbcb5-5a02-4193-87b2-8eefb8bcad5b';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentSummaryController],
      providers: [
        {
          provide: PaymentSummaryService,
          useValue: {
            getPaymentSummary: jest.fn().mockResolvedValue(mockPaymentSummary),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: mockUserId };
          return true;
        },
      })
      .compile();

    controller = module.get<PaymentSummaryController>(PaymentSummaryController);
    service = module.get<PaymentSummaryService>(PaymentSummaryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPaymentSummary', () => {
    it('should return payment summary for authenticated user', async () => {
      const result = await controller.getPaymentSummary(mockUserId);

      expect(result).toEqual(mockPaymentSummary);
      expect(service.getPaymentSummary).toHaveBeenCalledWith(mockUserId);
      expect(service.getPaymentSummary).toHaveBeenCalledTimes(1);
    });

    it('should call service with correct userId', async () => {
      const customerId = '1e5bbcb5-5a02-4193-87b2-8eefb8bcad5b';
      await controller.getPaymentSummary(customerId);

      expect(service.getPaymentSummary).toHaveBeenCalledWith(customerId);
    });

    it('should proagate errors from service', async () => {
      const errorMessage = 'Service error';
      jest
        .spyOn(service, 'getPaymentSummary')
        .mockRejectedValue(new Error(errorMessage));
      await expect(controller.getPaymentSummary(mockUserId)).rejects.toThrow(
        errorMessage,
      );
    });
  });
});
