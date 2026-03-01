import { IsNumber, IsString, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1, { message: 'Quantity must be greater than or equal to 1' })
  @Max(10, { message: 'Quantity must be less than or equal to 10' })
  quantity: number;
}
