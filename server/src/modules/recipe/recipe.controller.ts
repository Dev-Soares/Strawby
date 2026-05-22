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

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateRecipeDto) {
    return this.recipeService.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.recipeService.findAllByUser(req.user.sub);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.recipeService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateRecipeDto,
  ) {
    return this.recipeService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.recipeService.remove(id, req.user.sub);
  }

  @Post(':id/items')
  addFoodItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: AddFoodItemDto,
  ) {
    return this.recipeService.addFoodItem(id, req.user.sub, dto);
  }

  @Post(':id/private-items')
  addPrivateFoodItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: AddRecipePrivateFoodItemDto,
  ) {
    return this.recipeService.addPrivateFoodItem(id, req.user.sub, dto);
  }

  @Delete(':id/items/:itemId')
  removeItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    return this.recipeService.removeItem(id, itemId, req.user.sub);
  }
}
