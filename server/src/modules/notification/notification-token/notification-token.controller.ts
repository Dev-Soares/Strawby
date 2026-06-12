import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/common/guards/auth/auth.guard'
import type { AuthenticatedRequest } from 'src/common/types/req-types'
import { NotificationTokenService } from './notification-token.service'
import { CreateNotificationTokenDto } from './dto/create-notification-token.dto'
import { DeleteNotificationTokenDto } from './dto/delete-notification-token.dto'

@ApiTags('notification-token')
@Controller('notification/token')
export class NotificationTokenController {
  constructor(private readonly notificationTokenService: NotificationTokenService) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateNotificationTokenDto) {
    return this.notificationTokenService.create(req.user.sub, dto)
  }

  @UseGuards(AuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Body() dto: DeleteNotificationTokenDto) {
    return this.notificationTokenService.remove(dto.token)
  }
}
