import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
    @ApiProperty({ example: 'user@email.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'strongPassword123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
    password: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @ApiProperty({ example: 'patient', enum: Role })
    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;

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

    @ApiProperty({ example: '1.0' })
    @IsString()
    @IsNotEmpty()
    termsVersion: string;
}
