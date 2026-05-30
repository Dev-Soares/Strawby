import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConnectionRequestDto {
  @ApiProperty({ example: 'NUT-ABC123' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
