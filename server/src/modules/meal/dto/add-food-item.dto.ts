import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddFoodItemDto {
  @ApiProperty({ example: 'uuid-do-alimento' })
  @IsString()
  @IsNotEmpty()
  foodId: string;

  @ApiProperty({ example: 150, description: 'Quantidade em gramas' })
  @IsNumber()
  @Min(0.1)
  quantity: number;
}
