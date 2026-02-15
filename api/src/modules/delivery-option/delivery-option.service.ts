import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryOption } from './delivery-option.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeliveryOptionService {
  constructor(
    @InjectRepository(DeliveryOption)
    private readonly delOptRepository: Repository<DeliveryOption>,
  ) {}

  findAll(): Promise<DeliveryOption[]> {
    return this.delOptRepository.find();
  }

  findOne(id: string) {
    return this.delOptRepository.findOneBy({ id: id });
  }
}
