import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { AddMealItemDto } from './dto/add-meal-item.dto';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { MealService } from './meal.service';

@UseGuards(AuthGuard)
@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateMealDto) {
    return this.mealService.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.mealService.findAllByUser(req.user.sub);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.mealService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateMealDto,
  ) {
    return this.mealService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.mealService.remove(id, req.user.sub);
  }

  @Post(':id/items')
  addItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: AddMealItemDto,
  ) {
    return this.mealService.addItem(id, req.user.sub, dto);
  }

  @Delete(':id/items/:itemId')
  removeItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    return this.mealService.removeItem(id, itemId, req.user.sub);
  }
}
