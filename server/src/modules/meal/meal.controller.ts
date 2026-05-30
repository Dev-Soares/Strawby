import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { AddFoodItemDto } from './dto/add-food-item.dto';
import { AddMealPrivateFoodItemDto } from './dto/add-meal-private-food-item.dto';
import { AddMealRecipeDto } from './dto/add-meal-recipe.dto';
import { CreateMealDto } from './dto/create-meal.dto';
import { QueryMealDto } from './dto/query-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { MealService } from './meal.service';

@ApiTags('meal')
@UseGuards(AuthGuard)
@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post(':patientId')
  create(@Req() req: AuthenticatedRequest, @Param('patientId') patientId: string, @Body() dto: CreateMealDto) {
    return this.mealService.create(req.user.sub, patientId, dto);
  }

  @Get(':patientId')
  findAll(@Req() req: AuthenticatedRequest, @Param('patientId') patientId: string, @Query() query: QueryMealDto) {
    return this.mealService.findAllByPatient(req.user.sub, patientId, query.kind);
  }

  @Get(':patientId/day/:day')
  findAllByDay(@Req() req: AuthenticatedRequest, @Param('patientId') patientId: string, @Param('day') day: string, @Query() query: QueryMealDto) {
    return this.mealService.findAllByPatientAndDay(req.user.sub, patientId, day, query.kind);
  }

  @Get(':patientId/:id')
  findOne(@Req() req: AuthenticatedRequest, @Param('patientId') patientId: string, @Param('id') id: string) {
    return this.mealService.findOne(req.user.sub, patientId, id);
  }

  @Patch(':patientId/:id')
  update(@Req() req: AuthenticatedRequest, @Param('patientId') patientId: string, @Param('id') id: string, @Body() dto: UpdateMealDto) {
    return this.mealService.update(req.user.sub, patientId, id, dto);
  }

  @Delete(':patientId/:id')
  remove(@Req() req: AuthenticatedRequest, @Param('patientId') patientId: string, @Param('id') id: string) {
    return this.mealService.remove(req.user.sub, patientId, id);
  }

  @Post(':patientId/:id/items')
  addFoodItem(@Req() req: AuthenticatedRequest, @Param('patientId') patientId: string, @Param('id') id: string, @Body() dto: AddFoodItemDto) {
    return this.mealService.addFoodItem(req.user.sub, patientId, id, dto);
  }

  @Post(':patientId/:id/private-items')
  addPrivateFoodItem(@Req() req: AuthenticatedRequest, @Param('patientId') patientId: string, @Param('id') id: string, @Body() dto: AddMealPrivateFoodItemDto) {
    return this.mealService.addPrivateFoodItem(req.user.sub, patientId, id, dto);
  }

  @Delete(':patientId/:id/items/:itemId')
  removeItem(@Req() req: AuthenticatedRequest, @Param('patientId') patientId: string, @Param('id') id: string, @Param('itemId') itemId: string) {
    return this.mealService.removeItem(req.user.sub, patientId, id, itemId);
  }

  @Post(':patientId/:id/recipes')
  addRecipe(@Req() req: AuthenticatedRequest, @Param('patientId') patientId: string, @Param('id') id: string, @Body() dto: AddMealRecipeDto) {
    return this.mealService.addRecipe(req.user.sub, patientId, id, dto);
  }

  @Delete(':patientId/:id/recipes/:recipeId')
  removeRecipe(@Req() req: AuthenticatedRequest, @Param('patientId') patientId: string, @Param('id') id: string, @Param('recipeId') recipeId: string) {
    return this.mealService.removeRecipe(req.user.sub, patientId, id, recipeId);
  }
}
