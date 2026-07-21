import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CompleteOnboardingDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  acceptTerms: boolean;

  @ApiProperty({ example: '1.0' })
  @IsString()
  @IsNotEmpty()
  termsVersion: string;

  @ApiProperty({ example: 'patient', enum: ['patient', 'nutritionist'] })
  @IsEnum(['patient', 'nutritionist'], {
    message: 'Role deve ser patient ou nutritionist',
  })
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

  @ApiPropertyOptional({ example: '1996-03-15' })
  @IsISO8601({ strict: true })
  @IsOptional()
  birthDate?: string;

  @ApiPropertyOptional({ example: 'male', enum: ['male', 'female'] })
  @IsString()
  @IsIn(['male', 'female'])
  @IsOptional()
  gender?: string;

  // Obrigatório no fluxo de paciente (validado no front); opcional aqui
  // porque nutricionista completa o onboarding sem meta de peso.
  @ApiPropertyOptional({ example: 72 })
  @IsNumber()
  @Min(30)
  @Max(300)
  @IsOptional()
  targetWeight?: number;
}
