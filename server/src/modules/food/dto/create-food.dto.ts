import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CreateFoodDto {
  @ApiProperty({ example: 'Frango grelhado' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 165, description: 'Calorias por 100g (kcal)' })
  @IsNumber()
  @Min(0)
  calories: number;

  @ApiProperty({ example: 31, description: 'Proteínas por 100g (g)' })
  @IsNumber()
  @Min(0)
  protein: number;

  @ApiProperty({ example: 0, description: 'Carboidratos por 100g (g)' })
  @IsNumber()
  @Min(0)
  carbs: number;

  @ApiProperty({ example: 3.6, description: 'Gorduras por 100g (g)' })
  @IsNumber()
  @Min(0)
  fat: number;

  @ApiProperty({ example: 'MANUAL' })
  @IsIn(['TACO', 'USDA_FOUNDATION', 'USDA_SR_LEGACY', 'CNF', 'LIVS', 'OFF', 'MANUAL'])
  source: string;
}
