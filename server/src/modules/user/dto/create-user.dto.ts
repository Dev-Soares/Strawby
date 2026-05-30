import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
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
}
