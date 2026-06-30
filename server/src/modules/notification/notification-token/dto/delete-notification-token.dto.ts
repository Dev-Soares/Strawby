import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteNotificationTokenDto {
  @ApiProperty({ example: 'fGzK8x2t3r...FCM_TOKEN_HERE' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
