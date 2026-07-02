import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NutritionistService } from '../nutritionist/nutritionist.service';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';
import { CreateConnectionRequestDto } from './dto/create-connection-request.dto';
import {
  type ConnectionRequestPublic,
  type ConnectionRequestWithPatient,
  connectionRequestSelect,
  connectionRequestWithPatientSelect,
} from './types';
import { NotificationService } from '../notification/send-notification/notification.service';

@Injectable()
export class ConnectionRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nutritionistService: NutritionistService,
    private readonly notificationService: NotificationService,
  ) {}

  async makeRequest(
    patientId: string,
    dto: CreateConnectionRequestDto,
  ): Promise<ConnectionRequestPublic> {
    const nutritionist = await this.nutritionistService.findByCode(dto.code);

    try {
      const connectionRequest = await this.prisma.connectionRequest.create({
        data: {
          patientId,
          nutritionistId: nutritionist.id,
          status: 'PENDING',
        },
        select: connectionRequestSelect,
      });

      await this.notificationService.sendOne(
        nutritionist.id,
        'Nova solicitação de conexão',
        'Você recebeu uma nova solicitação de conexão de um paciente.',
      );

      return connectionRequest;
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar solicitação de conexão');
    }
  }

  async reject(
    id: string,
    nutritionistId: string,
  ): Promise<ConnectionRequestPublic> {
    try {
      const updated = await this.prisma.connectionRequest.update({
        where: { id, nutritionistId },
        data: { status: 'REJECTED' },
        select: connectionRequestSelect,
      });

      await this.notificationService.sendOne(
        updated.patientId,
        'Solicitação de conexão recusada',
        'Seu nutricionista recusou sua solicitação de conexão.',
      );

      return updated;
    } catch (error) {
      mapPrismaError(error, 'Erro ao rejeitar solicitação', {
        p2025: 'Solicitação não encontrada',
      });
    }
  }

  async accept(
    id: string,
    nutritionistId: string,
  ): Promise<ConnectionRequestPublic> {
    try {
      const updated = await this.prisma.connectionRequest.update({
        where: { id, nutritionistId },
        data: { status: 'ACCEPTED' },
        select: connectionRequestSelect,
      });

      await this.nutritionistService.connectPatient(
        updated.nutritionistId,
        updated.patientId,
      );

      await this.notificationService.sendOne(
        updated.patientId,
        'Solicitação de conexão aceita',
        'Seu nutricionista aceitou sua solicitação de conexão.',
      );

      return updated;
    } catch (error) {
      mapPrismaError(error, 'Erro ao aceitar solicitação');
    }
  }

  async findAllPendingByNutritionist(
    nutritionistId: string,
  ): Promise<ConnectionRequestWithPatient[]> {
    try {
      return await this.prisma.connectionRequest.findMany({
        where: { nutritionistId, status: 'PENDING' },
        select: connectionRequestWithPatientSelect,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar solicitações');
    }
  }

  async findAllByNutritionist(
    nutritionistId: string,
  ): Promise<ConnectionRequestWithPatient[]> {
    try {
      return await this.prisma.connectionRequest.findMany({
        where: { nutritionistId },
        select: connectionRequestWithPatientSelect,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar histórico de solicitações');
    }
  }
}
