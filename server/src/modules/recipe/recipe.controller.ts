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
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { AddFoodItemDto } from './dto/add-food-item.dto';
import { AddRecipePrivateFoodItemDto } from './dto/add-recipe-private-food-item.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeService } from './recipe.service';

@ApiTags('recipe')
@UseGuards(AuthGuard)
@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post(':patientId')
  create(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Body() dto: CreateRecipeDto,
  ) {
    return this.recipeService.create(req.user.sub, patientId, dto);
  }

  @Get(':patientId')
  findAll(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
  ) {
    return this.recipeService.findAllByPatient(req.user.sub, patientId);
  }

  @Get(':patientId/:id')
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Param('id') id: string,
  ) {
    return this.recipeService.findOne(req.user.sub, patientId, id);
  }

  @Patch(':patientId/:id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Param('id') id: string,
    @Body() dto: UpdateRecipeDto,
  ) {
    return this.recipeService.update(req.user.sub, patientId, id, dto);
  }

  @Delete(':patientId/:id')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Param('id') id: string,
  ) {
    return this.recipeService.remove(req.user.sub, patientId, id);
  }

  @Post(':patientId/:id/items')
  addFoodItem(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Param('id') id: string,
    @Body() dto: AddFoodItemDto,
  ) {
    return this.recipeService.addFoodItem(req.user.sub, patientId, id, dto);
  }

  @Post(':patientId/:id/private-items')
  addPrivateFoodItem(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Param('id') id: string,
    @Body() dto: AddRecipePrivateFoodItemDto,
  ) {
    return this.recipeService.addPrivateFoodItem(
      req.user.sub,
      patientId,
      id,
      dto,
    );
  }

  @Delete(':patientId/:id/items/:itemId')
  removeItem(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    return this.recipeService.removeItem(req.user.sub, patientId, id, itemId);
  }
}
