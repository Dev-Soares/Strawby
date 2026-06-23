import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateFoodItemDto {
  @ApiProperty({ example: 150, description: 'Quantidade em gramas' })
  @IsNumber()
  @Min(0.1)
  quantity: number;
}
