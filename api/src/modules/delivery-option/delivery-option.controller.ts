import { Controller, Get, Query } from '@nestjs/common';
import { DeliveryOptionService } from './delivery-option.service';

@Controller('delivery-options')
export class DeliveryOptionController {
  constructor(private readonly delOptService: DeliveryOptionService) {}

  @Get()
  async findAll(@Query('expand') expand: string) {
    let deliveryOptions = await this.delOptService.findAll();
    if (expand === 'estimatedDeliveryTime') {
      deliveryOptions = deliveryOptions.map((option) => {
        const deliveryTimeMs =
          Date.now() + option.deliveryDays * 24 * 60 * 60 * 1000;
        return {
          ...option,
          estimatedDeliveryTimeMs: deliveryTimeMs,
        };
      });

      return deliveryOptions;
    } else return deliveryOptions;
  }
}
