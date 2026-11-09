type ClampOptions = {
  /** Dígitos permitidos antes do separador decimal. */
  maxIntegerDigits?: number
  /** Casas decimais permitidas. 0 = apenas inteiros. */
  maxDecimals?: number
  /** `false` recusa zero à esquerda — peso e altura nunca começam com 0. */
  allowLeadingZero?: boolean
}

/**
 * Limita o texto digitado em campos numéricos (peso, altura, metas).
 * Remove qualquer caractere que não seja dígito ou ponto e corta o excedente,
 * em vez de deixar o usuário digitar um valor impossível e só errar na validação.
 */
export const clampNumericValue = (
  value: string,
  { maxIntegerDigits = 3, maxDecimals = 0, allowLeadingZero = true }: ClampOptions = {},
): string => {
  const [rawInteger = '', ...decimalParts] = value.replace(/[^\d.]/g, '').split('.')

  // "0", "007" e "0.5" não existem em kg nem em cm: o zero some enquanto digita,
  // em vez de virar erro de faixa só quando o usuário aperta continuar
  const integer = allowLeadingZero ? rawInteger : rawInteger.replace(/^0+/, '')
  const clampedInteger = integer.slice(0, maxIntegerDigits)

  if (!clampedInteger && !allowLeadingZero) return ''
  if (maxDecimals === 0 || decimalParts.length === 0) return clampedInteger

  const decimals = decimalParts.join('').slice(0, maxDecimals)
  return `${clampedInteger}.${decimals}`
}
