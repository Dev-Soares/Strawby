import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRecipeDto {
  @ApiProperty({ example: 'Omelete de Claras' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;
}
