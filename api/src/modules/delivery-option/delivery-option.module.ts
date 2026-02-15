import { Module } from '@nestjs/common';
import { DeliveryOptionController } from './delivery-option.controller';
import { DeliveryOptionService } from './delivery-option.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryOption } from './delivery-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryOption])],
  controllers: [DeliveryOptionController],
  providers: [DeliveryOptionService],
  exports: [DeliveryOptionService],
})
export class DeliveryOptionModule {}
