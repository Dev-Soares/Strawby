import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { OwnershipGuard } from 'src/common/guards/auth/ownership.guard';
import type { AuthenticatedRequest } from 'src/common/types/req-types';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Post('onboarding')
  completeOnboarding(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CompleteOnboardingDto,
  ) {
    return this.userService.completeOnboarding(req.user.sub, dto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async findMe(@Req() req: AuthenticatedRequest) {
    return this.userService.findOne(req.user.sub);
  }

  @UseGuards(AuthGuard, OwnershipGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, OwnershipGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, OwnershipGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
