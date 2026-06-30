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
import { CreatePrivateFoodDto } from './dto/create-private-food.dto';
import { UpdatePrivateFoodDto } from './dto/update-private-food.dto';
import { PrivateFoodService } from './private-food.service';

@ApiTags('private-food')
@UseGuards(AuthGuard)
@Controller('private-food')
export class PrivateFoodController {
  constructor(private readonly privateFoodService: PrivateFoodService) {}

  @Post(':patientId')
  create(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Body() dto: CreatePrivateFoodDto,
  ) {
    return this.privateFoodService.create(req.user.sub, patientId, dto);
  }

  @Get(':patientId')
  findAll(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
  ) {
    return this.privateFoodService.findAllByPatient(req.user.sub, patientId);
  }

  @Patch(':patientId/:id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePrivateFoodDto,
  ) {
    return this.privateFoodService.update(req.user.sub, patientId, id, dto);
  }

  @Delete(':patientId/:id')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('patientId') patientId: string,
    @Param('id') id: string,
  ) {
    return this.privateFoodService.remove(req.user.sub, patientId, id);
  }
}
