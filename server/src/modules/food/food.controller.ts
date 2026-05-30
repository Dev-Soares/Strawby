import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchFoodDto } from './dto/search-food.dto';
import { FoodService } from './food.service';

@ApiTags('food')
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('search')
  search(@Query() dto: SearchFoodDto) {
    return this.foodService.search(dto.search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodService.findOne(id);
  }
}
