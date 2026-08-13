/** Mínimo de caracteres para disparar a busca de alimentos */
export const MIN_SEARCH_LENGTH = 2

export const canSearch = (query: string): boolean =>
  query.trim().length >= MIN_SEARCH_LENGTH
