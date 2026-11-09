/** Token de injeção do provider de LLM ativo (OpenAI ou Gemini). */
export const LLM_PROVIDER = Symbol('LLM_PROVIDER');

/**
 * Falha de IA é indisponibilidade temporária (sem API key, provider fora,
 * rate limit), não bug do servidor — por isso 503 e não 500. O cliente usa
 * esse status pra responder na voz do mascote em vez de mostrar erro genérico.
 */
export const AI_UNAVAILABLE_MESSAGE =
  'Assistente indisponível no momento. Tente novamente mais tarde.';
