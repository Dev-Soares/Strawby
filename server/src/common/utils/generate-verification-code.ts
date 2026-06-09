// common/utils/generate-verification-code.ts
import { randomInt } from 'crypto'

export const generateVerificationCode = (): string =>
  randomInt(100000, 999999).toString()
