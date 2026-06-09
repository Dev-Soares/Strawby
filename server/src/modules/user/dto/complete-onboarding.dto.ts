import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CompleteOnboardingDto {
  @ApiProperty({ example: 'patient', enum: ['patient', 'nutritionist'] })
  @IsEnum(['patient', 'nutritionist'], { message: 'Role deve ser patient ou nutritionist' })
  @IsNotEmpty()
  role: 'patient' | 'nutritionist';

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

  @ApiPropertyOptional({ example: 25 })
  @IsInt()
  @Min(10)
  @Max(120)
  @IsOptional()
  age?: number;

  @ApiPropertyOptional({ example: 'male', enum: ['male', 'female'] })
  @IsString()
  @IsIn(['male', 'female'])
  @IsOptional()
  gender?: string;
}
