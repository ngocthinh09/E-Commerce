import { Test, TestingModule } from '@nestjs/testing';
import { PaymentSummaryService } from '../payment-summary.service';
import { ProductService } from '../../product/product.service';
import { DeliveryOptionService } from '../../delivery-option/delivery-option.service';
import { CartItemService } from '../../cart-item/cart-item.service';
import { defaultCart } from '../../../database/seeds/data/cart';
import { defaultProducts } from '../../../database/seeds/data/products';
import { defaultDeliveryOptions } from '../../../database/seeds/data/delivery-options';

const mockCartItems = defaultCart;
const mockProducts = defaultProducts;
const mockDeliveryOptions = defaultDeliveryOptions;

describe('PaymentSummaryService', () => {
  let service: PaymentSummaryService;
  let cartItemService: CartItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentSummaryService,
        {
          provide: ProductService,
          useValue: {
            findOne: jest.fn((id: string) =>
              Promise.resolve(mockProducts.find((item) => item.id === id)),
            ),
          },
        },
        {
          provide: DeliveryOptionService,
          useValue: {
            findOne: jest.fn((id: string) =>
              Promise.resolve(
                mockDeliveryOptions.find((item) => item.id === id),
              ),
            ),
          },
        },
        {
          provide: CartItemService,
          useValue: {
            findAll: jest.fn(() => Promise.resolve(mockCartItems)),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentSummaryService>(PaymentSummaryService);
    cartItemService = module.get<CartItemService>(CartItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPaymentSummary', () => {
    it('should calculate payment summary correctly', async () => {
      const result = await service.getPaymentSummary(
        '1e5bbcb5-5a02-4193-87b2-8eefb8bcad5b',
      );

      expect(result.totalItems).toBe(3);
      expect(result.productCostCents).toBe(4275);
      expect(result.shippingCostCents).toBe(499);
      expect(result.totalCostBeforeTaxCents).toBe(4774);
      expect(result.taxCents).toBe(477);
      expect(result.totalCostCents).toBe(5251);
    });

    it('should call cart item service with correct userId', async () => {
      await service.getPaymentSummary('1e5bbcb5-5a02-4193-87b2-8eefb8bcad5b');
      expect(cartItemService.findAll).toHaveBeenCalledWith(
        '1e5bbcb5-5a02-4193-87b2-8eefb8bcad5b',
      );
    });

    it('should handle empty cart', async () => {
      jest.spyOn(cartItemService, 'findAll').mockResolvedValue([]);

      const result = await service.getPaymentSummary(
        '1e5bbcb5-5a02-4193-87b2-8eefb8bcad5b',
      );

      expect(result.totalItems).toBe(0);
      expect(result.productCostCents).toBe(0);
      expect(result.shippingCostCents).toBe(0);
      expect(result.totalCostCents).toBe(0);
    });
  });
});
