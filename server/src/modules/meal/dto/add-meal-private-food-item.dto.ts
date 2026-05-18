import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddMealPrivateFoodItemDto {
  @ApiProperty({ example: 'uuid-do-alimento-privado' })
  @IsString()
  @IsNotEmpty()
  privateFoodId: string;

  @ApiProperty({ example: 150, description: 'Quantidade em gramas' })
  @IsNumber()
  @Min(0.1)
  quantity: number;
}
