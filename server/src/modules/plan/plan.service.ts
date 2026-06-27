import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { PatientService } from '../patient/patient.service';
import { MealKind } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';
import { PatientAccessService } from '../patient-access/patient-access.service';
import { MacroDistribution, PlanMacros, PlanPublic, planSelect } from './types';
import { PdfService } from '../pdf/pdf.service';
import { MealService } from '../meal/meal.service';

type GenerateParams = {
  weight: number;
  height: number;
  age: number;
  gender: string;
  movementLevel: number;
  goal: string | null;
};

@Injectable()
export class PlanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly patientAccess: PatientAccessService,
    private readonly pdfService: PdfService,
    private readonly mealService: MealService,
    @Inject(forwardRef(() => PatientService))
    private readonly patientService: PatientService,
  ) {}

  async create(callerId: string, patientId: string, dto: CreatePlanDto): Promise<PlanPublic> {
    await this.patientAccess.resolve(callerId, patientId);

    let planData: PlanMacros;

    if (dto.movementLevel) {
        const patient = await this.patientService.findById(patientId);
        const lastWeight = patient?.weightRecord[0];

      if (!lastWeight?.weight || !patient?.height || !patient?.birthDate || !patient?.gender) {
        throw new BadRequestException(
          'Preencha peso, altura, data de nascimento e sexo antes de gerar um plano automático',
        );
      }

      planData = this.generateRecomendedPlan({
        weight: lastWeight.weight,
        height: patient.height,
        age: this.calculateAge(patient.birthDate),
        gender: patient.gender,
        movementLevel: dto.movementLevel,
        goal: patient.goal,
      });
    } else if (
      dto.calories !== undefined &&
      dto.protein !== undefined &&
      dto.carbs !== undefined &&
      dto.fat !== undefined
    ) {
      planData = { calories: dto.calories, protein: dto.protein, carbs: dto.carbs, fat: dto.fat };
    } else {
      throw new BadRequestException('Informe as macros manualmente ou os dados para cálculo automático');
    }

    try {
      return await this.prisma.plan.create({
        data: { ...planData, patientId },
        select: planSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar plano', { p2002: 'Paciente já possui um plano' });
    }
  }

  async findByPatient(callerId: string, patientId: string): Promise<PlanPublic | null> {
    await this.patientAccess.resolve(callerId, patientId);
    return this.queryPlanByPatient(patientId);
  }

  async getPlanPdf(callerId: string, patientId: string): Promise<{ buffer: Buffer; filename: string }> {
    await this.patientAccess.resolve(callerId, patientId);

    const plan = await this.queryPlanByPatient(patientId);
    if (!plan) throw new BadRequestException('Plano não encontrado para o paciente');

    const [patientData, meals] = await Promise.all([
      this.prisma.patient.findUnique({
        where: { id: patientId },
        select: {
          user: { select: { name: true } },
          nutritionist: { select: { user: { select: { name: true } } } },
        },
      }),
      this.mealService.findAllByPatient(callerId, patientId, MealKind.PLAN),
    ]);

    const patientName = patientData?.user?.name ?? 'Paciente';

    const buffer = await this.pdfService.generatePlanPdf({
      plan,
      meals,
      patientName,
      nutritionistName: patientData?.nutritionist?.user?.name ?? 'Nutricionista',
    });

    return { buffer, filename: `Plano de ${patientName}.pdf` };
  }

  async queryPlansByPatientsBulk(patientIds: string[]): Promise<Map<string, PlanPublic | null>> {
    try {
      const plans = await this.prisma.plan.findMany({
        where: { patientId: { in: patientIds } },
        select: planSelect,
      });
      const map = new Map<string, PlanPublic | null>();
      for (const patientId of patientIds) map.set(patientId, null);
      for (const plan of plans) map.set(plan.patientId, plan);
      return map;
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar planos em lote');
    }
  }

  async queryPlanByPatient(patientId: string): Promise<PlanPublic | null> {
    try {
      return await this.prisma.plan.findUnique({ where: { patientId }, select: planSelect }) ?? null;
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar plano');
    }
  }

  async update(callerId: string, patientId: string, dto: UpdatePlanDto): Promise<PlanPublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      return await this.prisma.plan.update({
        where: { patientId },
        data: {
          ...(dto.calories !== undefined && { calories: dto.calories }),
          ...(dto.protein !== undefined && { protein: dto.protein }),
          ...(dto.carbs !== undefined && { carbs: dto.carbs }),
          ...(dto.fat !== undefined && { fat: dto.fat }),
        },
        select: planSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao atualizar plano', { p2025: 'Plano não encontrado' });
    }
  }

  async remove(callerId: string, patientId: string): Promise<{ id: string }> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      return await this.prisma.plan.delete({ where: { patientId }, select: { id: true } });
    } catch (error) {
      mapPrismaError(error, 'Erro ao deletar plano', { p2025: 'Plano não encontrado' });
    }
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }

  private generateRecomendedPlan(params: GenerateParams): PlanMacros {
    const userTmb = this.getUserTmb(params.weight, params.height, params.age, params.gender);
    const userDailyCalories = userTmb * params.movementLevel;
    const caloriesForPlan = userDailyCalories - (this.getCaloriesForGoal(params.goal));
    const macros = this.generateMacrosNumbers(caloriesForPlan, params.goal, params.weight);
    return { calories: Math.round(caloriesForPlan), ...macros };
  }

  private getCaloriesForGoal(goal: string | null): number {
    switch (goal) {
      case 'lose': return 400;
      case 'gain': return -400;
      case 'mantain': return 0;
      default: return 0;
    }
  }

  private generateMacrosNumbers(calories: number, goal: string | null, weight: number): MacroDistribution {
    const protein = Math.round(weight * (goal === 'lose' ? 1.8 : 1.6));
    const fat = Math.round(weight * (goal === 'lose' ? 0.8 : 1.0));
    const carbs = Math.round(Math.max(calories - protein * 4 - fat * 9, 0) / 4);
    return { protein, carbs, fat };
  }

  // Mifflin-St Jeor (1990)
  private getUserTmb(weight: number, height: number, age: number, gender: string) {
    const base = 10 * weight + 6.25 * height - 5 * age;
    if (gender === 'male') return base + 5;
    if (gender === 'female') return base - 161;
    return base;
  }
}
