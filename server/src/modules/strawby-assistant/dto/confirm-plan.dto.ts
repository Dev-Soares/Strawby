import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class ConfirmPlanDto {
  @ApiProperty({ example: 2000 })
  @IsNumber()
  @Min(0)
  calories: number;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(0)
  protein: number;

  @ApiProperty({ example: 250 })
  @IsNumber()
  @Min(0)
  carbs: number;

  @ApiProperty({ example: 70 })
  @IsNumber()
  @Min(0)
  fat: number;
}
