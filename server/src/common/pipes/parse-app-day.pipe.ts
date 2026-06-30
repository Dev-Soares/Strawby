import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

const APP_DAY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Valida um parâmetro de rota como data pura 'YYYY-MM-DD'.
 *
 * USO: @Param('day', ParseAppDayPipe) em rotas consumidas por
 * parseAppDay/appDayRange. Garante o mesmo contrato de @IsAppDay para params,
 * que não passam por DTO/ValidationPipe.
 */
@Injectable()
export class ParseAppDayPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!APP_DAY_REGEX.test(value)) {
      throw new BadRequestException('A data deve estar no formato YYYY-MM-DD');
    }
    return value;
  }
}
