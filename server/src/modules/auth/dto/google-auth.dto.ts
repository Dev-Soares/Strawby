import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty({ example: '4/0AeanS0b...' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'https://app.strawby.com/app/google-callback' })
  @IsString()
  @IsNotEmpty()
  redirectUri: string;
}
