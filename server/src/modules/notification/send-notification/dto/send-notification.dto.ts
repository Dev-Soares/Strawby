import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'

export class SendNotificationDto {
  @ApiProperty({ example: 'Novo plano disponível' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: 'Seu nutricionista criou um novo plano alimentar.' })
  @IsString()
  @IsNotEmpty()
  body: string

  @ApiPropertyOptional({ example: { type: 'plan_update' } })
  @IsObject()
  @IsOptional()
  data?: Record<string, string>
}
