import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateNotificationTokenDto {
  @ApiProperty({ example: 'fGzK8x2t3r...FCM_TOKEN_HERE' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: '8f3b2c1a-9d4e-4f7a-b2c6-1e5d8a0f3b94' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  deviceId: string;
}
