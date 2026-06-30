import { PartialType } from '@nestjs/swagger';
import { CreateConnectionRequestDto } from './create-connection-request.dto';

export class UpdateConnectionRequestDto extends PartialType(
  CreateConnectionRequestDto,
) {}
