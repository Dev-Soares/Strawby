import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRecipeDto {
  @ApiPropertyOptional({ example: 'Omelete de Claras' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;
}
