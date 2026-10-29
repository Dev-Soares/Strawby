type ClampOptions = {
  /** Dígitos permitidos antes do separador decimal. */
  maxIntegerDigits?: number
  /** Casas decimais permitidas. 0 = apenas inteiros. */
  maxDecimals?: number
}

/**
 * Limita o texto digitado em campos numéricos (peso, altura, metas).
 * Remove qualquer caractere que não seja dígito ou ponto e corta o excedente,
 * em vez de deixar o usuário digitar um valor impossível e só errar na validação.
 */
export const clampNumericValue = (
  value: string,
  { maxIntegerDigits = 3, maxDecimals = 0 }: ClampOptions = {},
): string => {
  const [integer = '', ...decimalParts] = value.replace(/[^\d.]/g, '').split('.')
  const clampedInteger = integer.slice(0, maxIntegerDigits)

  if (maxDecimals === 0 || decimalParts.length === 0) return clampedInteger

  const decimals = decimalParts.join('').slice(0, maxDecimals)
  return `${clampedInteger}.${decimals}`
}
