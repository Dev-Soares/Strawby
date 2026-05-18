import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreatePrivateFoodDto {
  @ApiProperty({ example: 'Marmita de frango' })
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

  @ApiProperty({ example: 0, description: 'Fibras por 100g (g)', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  fiber?: number;

  @ApiProperty({ example: 0.05, description: 'Sódio por 100g (g)', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  sodium?: number;

  @ApiProperty({ example: '100g', description: 'Porção de referência', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  servingSize?: string;
}
