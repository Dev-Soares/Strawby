import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { PatientService } from '../patient/patient.service';
import { MealKind, PlanSource } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';
import { PatientAccessService } from '../patient-access/patient-access.service';
import { MacroDistribution, PlanMacros, PlanPublic, planSelect } from './types';
import { PdfService } from '../pdf/pdf.service';
import { MealService } from '../meal/meal.service';
import { NotificationService } from '../notification/send-notification/notification.service';
import {
  ADJUSTED_WEIGHT_BMI_THRESHOLD,
  CALORIE_ADJUSTMENT_RATE,
  DEFAULT_FAT_PER_KG,
  DEFAULT_PROTEIN_PER_KG,
  EXCESS_WEIGHT_FACTOR,
  FALLBACK_MIN_DAILY_CALORIES,
  FAT_PER_KG,
  HEALTHY_BMI_CEILING,
  KCAL_PER_GRAM,
  MAX_CARB_CALORIE_SHARE,
  MAX_PROTEIN_PER_KG,
  MIN_DAILY_CALORIES,
  MIN_FAT_CALORIE_SHARE,
  PROTEIN_PER_KG,
} from './utils/macro-constants';

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
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => PatientService))
    private readonly patientService: PatientService,
  ) {}

  async create(
    callerId: string,
    patientId: string,
    dto: CreatePlanDto,
    source?: PlanSource,
  ): Promise<PlanPublic> {
    await this.patientAccess.resolve(callerId, patientId);

    let planData: PlanMacros;

    if (dto.movementLevel) {
      planData = await this.generateRecommendedMacros(
        patientId,
        dto.movementLevel,
      );
    } else if (
      dto.calories !== undefined &&
      dto.protein !== undefined &&
      dto.carbs !== undefined &&
      dto.fat !== undefined
    ) {
      planData = {
        calories: dto.calories,
        protein: dto.protein,
        carbs: dto.carbs,
        fat: dto.fat,
      };
    } else {
      throw new BadRequestException(
        'Informe as macros manualmente ou os dados para cálculo automático',
      );
    }

    try {
      const plan = await this.prisma.plan.create({
        data: {
          ...planData,
          patientId,
          source: source ?? this.resolveSource(callerId, patientId),
        },
        select: planSelect,
      });

      // notifica o paciente apenas quando o nutricionista cria o plano
      if (callerId !== patientId) {
        await this.notificationService.sendOne(
          patientId,
          'Novo plano alimentar',
          'Seu nutricionista criou um plano alimentar para você.',
        );
      }

      return plan;
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar plano', {
        p2002: 'Paciente já possui um plano',
      });
    }
  }

  /**
   * Calcula as macros recomendadas a partir do perfil do paciente, sem gravar
   * nada. Usado pelo fluxo automático do `create` e pelo assistente Strawby.
   */
  async generateRecommendedMacros(
    patientId: string,
    movementLevel: number,
  ): Promise<PlanMacros> {
    const patient = await this.patientService.findById(patientId);
    const lastWeight = patient?.weightRecord[0];

    if (
      !lastWeight?.weight ||
      !patient?.height ||
      !patient?.birthDate ||
      !patient?.gender
    ) {
      throw new BadRequestException(
        'Preencha peso, altura, data de nascimento e sexo antes de gerar um plano automático',
      );
    }

    // sem meta definida → mantém (sem déficit/superávit)
    const goal =
      patient.targetWeight != null
        ? this.getGoal(patient.targetWeight, lastWeight.weight)
        : 'maintain';

    return this.generateRecomendedPlan({
      weight: lastWeight.weight,
      height: patient.height,
      age: this.calculateAge(patient.birthDate),
      gender: patient.gender,
      movementLevel,
      goal,
    });
  }

  async findByPatient(
    callerId: string,
    patientId: string,
  ): Promise<PlanPublic | null> {
    await this.patientAccess.resolve(callerId, patientId);
    return this.queryPlanByPatient(patientId);
  }

  async getPlanPdf(
    callerId: string,
    patientId: string,
  ): Promise<{ buffer: Buffer; filename: string }> {
    await this.patientAccess.resolve(callerId, patientId);

    const plan = await this.queryPlanByPatient(patientId);
    if (!plan)
      throw new BadRequestException('Plano não encontrado para o paciente');

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
      nutritionistName:
        patientData?.nutritionist?.user?.name ?? 'Nutricionista',
    });

    return { buffer, filename: `Plano de ${patientName}.pdf` };
  }

  async queryPlansByPatientsBulk(
    patientIds: string[],
  ): Promise<Map<string, PlanPublic | null>> {
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
      return (
        (await this.prisma.plan.findUnique({
          where: { patientId },
          select: planSelect,
        })) ?? null
      );
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar plano');
    }
  }

  async update(
    callerId: string,
    patientId: string,
    dto: UpdatePlanDto,
    source?: PlanSource,
  ): Promise<PlanPublic> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      const plan = await this.prisma.plan.update({
        where: { patientId },
        data: {
          ...(dto.calories !== undefined && { calories: dto.calories }),
          ...(dto.protein !== undefined && { protein: dto.protein }),
          ...(dto.carbs !== undefined && { carbs: dto.carbs }),
          ...(dto.fat !== undefined && { fat: dto.fat }),
          // quem edita assume a autoria: um plano revisado à mão deixa de ser
          // estimativa do app
          source: source ?? this.resolveSource(callerId, patientId),
        },
        select: planSelect,
      });

      // notifica o paciente apenas quando o nutricionista atualiza o plano
      if (callerId !== patientId) {
        await this.notificationService.sendOne(
          patientId,
          'Plano alimentar atualizado',
          'Seu nutricionista atualizou seu plano alimentar.',
        );
      }

      return plan;
    } catch (error) {
      mapPrismaError(error, 'Erro ao atualizar plano', {
        p2025: 'Plano não encontrado',
      });
    }
  }

  async remove(callerId: string, patientId: string): Promise<{ id: string }> {
    await this.patientAccess.resolve(callerId, patientId);
    try {
      return await this.prisma.plan.delete({
        where: { patientId },
        select: { id: true },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao deletar plano', {
        p2025: 'Plano não encontrado',
      });
    }
  }

  /** Nutricionista prescreve; o próprio paciente digitando é entrada manual. */
  private resolveSource(callerId: string, patientId: string): PlanSource {
    return callerId === patientId ? PlanSource.MANUAL : PlanSource.NUTRITIONIST;
  }

  private getGoal(targetWeight: number, actualWeight: number): string {
    const weightDifference = targetWeight - actualWeight;
    if (Math.abs(weightDifference) <= 1) return 'maintain';
    return weightDifference < 0 ? 'lose' : 'gain';
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }

  private generateRecomendedPlan(params: GenerateParams): PlanMacros {
    const tmb = this.getUserTmb(
      params.weight,
      params.height,
      params.age,
      params.gender,
    );
    const tdee = tmb * params.movementLevel;
    const caloriesForPlan = this.applyGoalAdjustment(
      tdee,
      tmb,
      params.goal,
      params.gender,
    );

    const macros = this.generateMacrosNumbers(
      caloriesForPlan,
      params.goal,
      this.getMacroWeight(params.weight, params.height),
    );

    // as calorias vêm da soma dos macros, não do alvo: arredondamento e piso de
    // gordura mudam o total, e o número gravado não pode divergir dos gramas
    const calories =
      macros.protein * KCAL_PER_GRAM.protein +
      macros.carbs * KCAL_PER_GRAM.carbs +
      macros.fat * KCAL_PER_GRAM.fat;

    return { calories, ...macros };
  }

  /**
   * Aplica déficit/superávit percentual sobre o TDEE e protege o resultado com
   * dois pisos: a própria TMB (nunca prescrever abaixo do gasto basal) e um
   * mínimo absoluto por sexo.
   */
  private applyGoalAdjustment(
    tdee: number,
    tmb: number,
    goal: string | null,
    gender: string,
  ): number {
    const rate = CALORIE_ADJUSTMENT_RATE[goal ?? 'maintain'] ?? 0;
    const target = tdee * (1 + rate);

    const absoluteFloor =
      MIN_DAILY_CALORIES[gender] ?? FALLBACK_MIN_DAILY_CALORIES;

    return Math.max(target, tmb, absoluteFloor);
  }

  /**
   * Peso usado nas metas em g/kg. Acima de IMC 30 o excesso de gordura não
   * demanda proteína/gordura proporcional — contar o peso cheio estourava o
   * orçamento calórico e zerava os carboidratos.
   */
  private getMacroWeight(weight: number, height: number): number {
    const heightInMeters = height / 100;
    const bmi = weight / heightInMeters ** 2;

    if (bmi <= ADJUSTED_WEIGHT_BMI_THRESHOLD) return weight;

    const healthyWeight = HEALTHY_BMI_CEILING * heightInMeters ** 2;
    return healthyWeight + (weight - healthyWeight) * EXCESS_WEIGHT_FACTOR;
  }

  private generateMacrosNumbers(
    calories: number,
    goal: string | null,
    macroWeight: number,
  ): MacroDistribution {
    const goalKey = goal ?? 'maintain';

    let protein = Math.round(
      macroWeight * (PROTEIN_PER_KG[goalKey] ?? DEFAULT_PROTEIN_PER_KG),
    );

    // piso hormonal: gordura nunca abaixo de 20% das calorias
    const minFat = Math.round(
      (calories * MIN_FAT_CALORIE_SHARE) / KCAL_PER_GRAM.fat,
    );
    let fat = Math.max(
      Math.round(macroWeight * (FAT_PER_KG[goalKey] ?? DEFAULT_FAT_PER_KG)),
      minFat,
    );

    const remaining =
      calories - protein * KCAL_PER_GRAM.protein - fat * KCAL_PER_GRAM.fat;
    let carbs = Math.max(Math.round(remaining / KCAL_PER_GRAM.carbs), 0);

    // carboidrato é residual: em TDEE alto sobra tanto que passa de 65% do
    // plano. O excedente acima do teto vai para proteína (até o limite de g/kg)
    // e o que ainda restar, para gordura.
    const maxCarbs = Math.round(
      (calories * MAX_CARB_CALORIE_SHARE) / KCAL_PER_GRAM.carbs,
    );

    if (carbs > maxCarbs) {
      let surplus = (carbs - maxCarbs) * KCAL_PER_GRAM.carbs;
      carbs = maxCarbs;

      const proteinRoom = Math.max(
        Math.round(macroWeight * MAX_PROTEIN_PER_KG) - protein,
        0,
      );
      const proteinGain = Math.min(
        proteinRoom,
        Math.floor(surplus / KCAL_PER_GRAM.protein),
      );
      protein += proteinGain;
      surplus -= proteinGain * KCAL_PER_GRAM.protein;

      fat += Math.round(surplus / KCAL_PER_GRAM.fat);
    }

    return { protein, carbs, fat };
  }

  // Mifflin-St Jeor (1990)
  private getUserTmb(
    weight: number,
    height: number,
    age: number,
    gender: string,
  ) {
    const base = 10 * weight + 6.25 * height - 5 * age;
    if (gender === 'male') return base + 5;
    if (gender === 'female') return base - 161;
    return base;
  }
}
