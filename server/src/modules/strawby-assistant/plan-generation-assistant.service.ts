import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PatientAccessService } from '../patient-access/patient-access.service';
import { PlanService } from '../plan/plan.service';
import { PreviewPlanDto } from './dto/preview-plan.dto';
import { ConfirmPlanDto } from './dto/confirm-plan.dto';
import type { PlanMacros } from '../plan/types';

/** Macros calculadas mas ainda não salvas — o usuário precisa confirmar. */
type PlanDraft = PlanMacros & {
  /** Já existe plano: confirmar substitui o atual. */
  replacesExisting: boolean;
};

@Injectable()
export class PlanGenerationAssistantService {
  constructor(
    private readonly plan: PlanService,
    private readonly patientAccess: PatientAccessService,
  ) {}

  /**
   * Calcula o plano recomendado mas NÃO salva — devolve um rascunho pro
   * usuário conferir. A gravação acontece em `confirmPlan`.
   */
  async previewPlan(callerId: string, patientId: string, dto: PreviewPlanDto) {
    await this.patientAccess.resolve(callerId, patientId);

    let macros: PlanMacros;
    try {
      macros = await this.plan.generateRecommendedMacros(
        patientId,
        dto.movementLevel,
      );
    } catch (error) {
      // perfil incompleto é um desfecho esperado da conversa, não um erro de
      // requisição — o mascote avisa o que falta no lugar de um toast
      if (error instanceof BadRequestException) {
        return {
          reply: {
            id: randomUUID(),
            role: 'assistant',
            content:
              'Pra calcular seu plano eu preciso do seu peso, altura, data de nascimento e sexo. Completa seu perfil e volta aqui que eu monto pra você!',
            createdAt: new Date().toISOString(),
            status: 'not_found',
            suggestedMeals: [],
          },
        };
      }
      throw error;
    }

    const existing = await this.plan.queryPlanByPatient(patientId);

    const draft: PlanDraft = {
      ...macros,
      replacesExisting: existing !== null,
    };

    return {
      reply: {
        id: randomUUID(),
        role: 'assistant',
        // o aviso de substituição fica no card — a fala curta não repete
        content:
          'Esse foi o plano que calculei pra você! Dá uma olhada e confirma se podemos salvar.',
        createdAt: new Date().toISOString(),
        status: 'plan_preview',
        planDraft: draft,
        suggestedMeals: [],
      },
    };
  }

  /** Grava o plano que o usuário confirmou — substitui o atual se existir. */
  async confirmPlan(callerId: string, patientId: string, dto: ConfirmPlanDto) {
    await this.patientAccess.resolve(callerId, patientId);

    const existing = await this.plan.queryPlanByPatient(patientId);

    const macros = {
      calories: dto.calories,
      protein: dto.protein,
      carbs: dto.carbs,
      fat: dto.fat,
    };

    const plan = existing
      ? await this.plan.update(callerId, patientId, macros)
      : await this.plan.create(callerId, patientId, macros);

    return {
      reply: {
        id: randomUUID(),
        role: 'assistant',
        content: this.buildCreatedMessage(existing !== null, plan.calories),
        createdAt: new Date().toISOString(),
        status: 'created',
        suggestedMeals: [],
      },
    };
  }

  /** Comemoração do plano salvo — variada pro assistente não soar robótico. */
  private buildCreatedMessage(replaced: boolean, calories: number): string {
    const openings = [
      'Prontinho!',
      'Boa!',
      'Feito!',
      'Pode deixar!',
      'Anotado!',
    ];
    const opening = openings[Math.floor(Math.random() * openings.length)];
    const rounded = Math.round(calories).toLocaleString('pt-BR');
    const action = replaced ? 'Atualizei seu plano' : 'Criei seu plano';

    return `${opening} ${action} com meta de ${rounded} kcal por dia. Bora bater essas metas!`;
  }
}
