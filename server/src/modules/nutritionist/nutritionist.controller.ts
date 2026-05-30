import { Controller, Get, Post, Req, UseGuards, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { NutritionistService } from './nutritionist.service';
import { CreateCodeDto } from './dto/create-code.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';

@ApiTags('nutritionist')
@UseGuards(AuthGuard, RolesGuard)
@Roles('nutritionist')
@Controller('nutritionist')
export class NutritionistController {
  constructor(private readonly nutritionistService: NutritionistService) {}

  @Get('me')
  findMe(@Req() req: AuthenticatedRequest) {
    return this.nutritionistService.findOne(req.user.sub);
  }

  @Get('me/patients')
  findMyPatients(@Req() req: AuthenticatedRequest) {
    return this.nutritionistService.findPatients(req.user.sub);
  }

  @Post('me/code')
  updateCode(
    @Req() req: AuthenticatedRequest,
    @Body() createCodeDto: CreateCodeDto,
  ) {
    return this.nutritionistService.updateCode(req.user.sub, createCodeDto);
  }
}
