import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateFoodDto {
  @ApiPropertyOptional({ example: 'Frango grelhado' })
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
}
