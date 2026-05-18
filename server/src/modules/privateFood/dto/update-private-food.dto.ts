import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdatePrivateFoodDto {
  @ApiPropertyOptional({ example: 'Marmita de frango' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ example: 165 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  calories?: number;

  @ApiPropertyOptional({ example: 31 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  protein?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  carbs?: number;

  @ApiPropertyOptional({ example: 3.6 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  fat?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  fiber?: number;

  @ApiPropertyOptional({ example: 0.05 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  sodium?: number;

  @ApiPropertyOptional({ example: '100g' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  servingSize?: string;
}
