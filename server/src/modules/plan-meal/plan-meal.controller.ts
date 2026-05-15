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
import { AddPlanMealItemDto } from './dto/add-plan-meal-item.dto';
import { CreatePlanMealDto } from './dto/create-plan-meal.dto';
import { UpdatePlanMealDto } from './dto/update-plan-meal.dto';
import { PlanMealService } from './plan-meal.service';

@UseGuards(AuthGuard)
@Controller('plan-meal')
export class PlanMealController {
  constructor(private readonly planMealService: PlanMealService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreatePlanMealDto) {
    return this.planMealService.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.planMealService.findAllByUser(req.user.sub);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.planMealService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdatePlanMealDto,
  ) {
    return this.planMealService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.planMealService.remove(id, req.user.sub);
  }

  @Post(':id/items')
  addItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: AddPlanMealItemDto,
  ) {
    return this.planMealService.addItem(id, req.user.sub, dto);
  }

  @Delete(':id/items/:itemId')
  removeItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    return this.planMealService.removeItem(id, itemId, req.user.sub);
  }
}
