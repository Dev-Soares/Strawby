import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ConnectionRequestService } from './connection-request.service';
import { CreateConnectionRequestDto } from './dto/create-connection-request.dto';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { RolesGuard } from '../../common/guards/auth/roles.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(AuthGuard)
@Controller('connection-request')
export class ConnectionRequestController {
  constructor(
    private readonly connectionRequestService: ConnectionRequestService,
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Roles('patient')
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  makeRequest(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateConnectionRequestDto,
  ) {
    return this.connectionRequestService.makeRequest(req.user.sub, dto);
  }

  @Roles('nutritionist')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id/reject')
  reject(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.connectionRequestService.reject(id, req.user.sub);
  }

  @Roles('nutritionist')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id/accept')
  accept(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.connectionRequestService.accept(id, req.user.sub);
  }
  @Roles('nutritionist')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('nutritionist')
  findAllPendingByNutritionist(@Req() req: AuthenticatedRequest) {
    return this.connectionRequestService.findAllPendingByNutritionist(
      req.user.sub,
    );
  }

  @Roles('nutritionist')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('nutritionist/history')
  findAllByNutritionist(@Req() req: AuthenticatedRequest) {
    return this.connectionRequestService.findAllByNutritionist(req.user.sub);
  }

  @Roles('patient')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('patient')
  findAllByPatient(@Req() req: AuthenticatedRequest) {
    return this.connectionRequestService.findAllByPatient(req.user.sub);
  }
}
