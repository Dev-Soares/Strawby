/**
 * Espelha `ASSISTANT_QUOTA_EXCEEDED_CODE` do backend. Serve pra separar o 429
 * de cota esgotada do 429 do throttle por IP — o mascote fala coisas
 * diferentes em cada caso.
 */
export const ASSISTANT_QUOTA_EXCEEDED_CODE = 'ASSISTANT_QUOTA_EXCEEDED'
