import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePatientDto {
  @ApiPropertyOptional({ example: 70 })
  @IsNumber()
  @Min(30)
  @Max(300)
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ example: 175 })
  @IsNumber()
  @Min(100)
  @Max(250)
  @IsOptional()
  height?: number;

  @ApiPropertyOptional({ example: '1996-03-15' })
  @IsISO8601({ strict: true })
  @IsOptional()
  birthDate?: string;

  @ApiPropertyOptional({ example: 'male', enum: ['male', 'female'] })
  @IsString()
  @IsIn(['male', 'female'])
  @IsOptional()
  gender?: string;

  @ApiProperty({ example: 72 })
  @IsNumber()
  @Min(30)
  @Max(300)
  @IsNotEmpty()
  targetWeight: number;
}
