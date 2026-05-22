import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { CreateFoodDto } from './dto/create-food.dto';
import { SearchFoodDto } from './dto/search-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FoodService } from './food.service';

@ApiTags('food')
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreateFoodDto) {
    return this.foodService.create(dto);
  }

  @Get('search')
  search(@Query() dto: SearchFoodDto) {
    return this.foodService.search(dto.search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFoodDto) {
    return this.foodService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodService.remove(id);
  }
}
