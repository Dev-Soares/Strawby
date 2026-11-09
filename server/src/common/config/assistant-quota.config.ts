/**
 * Teto de chamadas pagas ao LLM por usuário, por dia.
 *
 * Mora no código, não no banco: o banco guarda só quantas chamadas o usuário
 * fez (`User.assistantUsageCount`). Mudar este número passa a valer na hora
 * para todo mundo, sem migration e sem reajustar linha nenhuma.
 */
export const ASSISTANT_DAILY_LIMIT = 15;

/**
 * Marca o 429 de cota esgotada. O `@Throttle` por IP também responde 429, e o
 * front precisa separar os dois: um é "esperou demais numa rajada", o outro é
 * "acabou o dia". Vai no corpo do erro, não no status.
 */
export const ASSISTANT_QUOTA_EXCEEDED_CODE = 'ASSISTANT_QUOTA_EXCEEDED';
