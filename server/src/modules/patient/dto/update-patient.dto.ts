import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsISO8601, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdatePatientDto {
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

  @ApiPropertyOptional({ example: 'lose', enum: ['lose', 'gain', 'mantain'] })
  @IsString()
  @IsIn(['lose', 'gain', 'mantain'])
  @IsOptional()
  goal?: 'lose' | 'gain' | 'mantain';
}
