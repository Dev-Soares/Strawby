import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'novo@email.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

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
