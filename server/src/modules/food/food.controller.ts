import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { SearchFoodDto } from './dto/search-food.dto';
import { FoodService } from './food.service';

@ApiTags('food')
@UseGuards(AuthGuard)
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
