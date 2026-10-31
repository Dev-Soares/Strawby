import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { SendAssistantMessageDto } from './dto/send-message.dto';
import { StrawbyAssistantService } from './strawby-assistant.service';

@ApiTags('strawby-assistant')
@UseGuards(AuthGuard)
@Controller('strawby-assistant')
export class StrawbyAssistantController {
  constructor(private readonly assistant: StrawbyAssistantService) {}

  @Post('create-meal')
  createMeal(
    @Req() req: AuthenticatedRequest,
    @Body() dto: SendAssistantMessageDto,
  ) {
    return this.assistant.processMessage(req.user.sub, req.user.sub, dto);
  }
}
