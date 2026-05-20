import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { OptionalAuthRequest } from 'src/common/types/req-types';
import { OptionalAuthGuard } from 'src/common/guards/auth/optionalAuth.guard';
import { OwnershipGuard } from 'src/common/guards/auth/ownership.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(OptionalAuthGuard)
  @Get('me')
  async findMe(@Req() req: OptionalAuthRequest) {
    const user = req.user;
    if (!user) return null;
    return this.userService.findOne(user.sub);
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
