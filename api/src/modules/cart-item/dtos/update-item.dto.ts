import { IsNumber, IsString, Min, IsOptional } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  deliveryOptionId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Quantity must be greater than or equal to 1' })
  quantity?: number;
}
