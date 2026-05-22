import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SearchFoodDto {
  @ApiProperty({ example: 'arroz' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'A busca deve ter no mínimo 2 caracteres' })
  @MaxLength(100)
  search: string;
}
