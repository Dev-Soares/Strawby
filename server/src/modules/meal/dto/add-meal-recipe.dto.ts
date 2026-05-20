import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddMealRecipeDto {
  @ApiProperty({ example: 'uuid-da-receita' })
  @IsString()
  @IsNotEmpty()
  recipeId: string;
}
