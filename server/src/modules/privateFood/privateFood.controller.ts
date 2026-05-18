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
import { CreatePrivateFoodDto } from './dto/create-private-food.dto';
import { UpdatePrivateFoodDto } from './dto/update-private-food.dto';
import { PrivateFoodService } from './privateFood.service';

@UseGuards(AuthGuard)
@Controller('private-food')
export class PrivateFoodController {
  constructor(private readonly privateFoodService: PrivateFoodService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreatePrivateFoodDto) {
    return this.privateFoodService.create(req.user.sub, dto);
  }

  @Get()
  findAllByUser(@Req() req: AuthenticatedRequest) {
    return this.privateFoodService.findAllByUser(req.user.sub);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdatePrivateFoodDto,
  ) {
    return this.privateFoodService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.privateFoodService.remove(id, req.user.sub);
  }
}
