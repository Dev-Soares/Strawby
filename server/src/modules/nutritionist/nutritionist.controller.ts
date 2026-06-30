import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/req-types';
import { NutritionistService } from './nutritionist.service';
import { CreateCodeDto } from './dto/create-code.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';

@ApiTags('nutritionist')
@UseGuards(AuthGuard)
@Controller('nutritionist')
export class NutritionistController {
  constructor(private readonly nutritionistService: NutritionistService) {}

  @Roles('nutritionist')
  @UseGuards(RolesGuard)
  @Get('me')
  findMe(@Req() req: AuthenticatedRequest) {
    return this.nutritionistService.findOne(req.user.sub);
  }

  @Roles('nutritionist')
  @UseGuards(RolesGuard)
  @Get('me/patients')
  findMyPatients(@Req() req: AuthenticatedRequest) {
    return this.nutritionistService.findPatients(req.user.sub);
  }

  @Roles('nutritionist')
  @UseGuards(RolesGuard)
  @Post('me/code')
  updateCode(
    @Req() req: AuthenticatedRequest,
    @Body() createCodeDto: CreateCodeDto,
  ) {
    return this.nutritionistService.updateCode(req.user.sub, createCodeDto);
  }

  @Roles('patient')
  @UseGuards(RolesGuard)
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  disconnectNutritionist(@Req() req: AuthenticatedRequest) {
    return this.nutritionistService.disconnectPatient(req.user.sub);
  }
}
