import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCodeDto {
  @ApiProperty({ example: 'NUTRI2024' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  code: string;
}
