import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendAssistantMessageDto {
  @ApiProperty({ example: 'Comi arroz, feijão e frango' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message: string;
}
