// decorator que seta a role necessaria para o guard verificar

import { SetMetadata } from '@nestjs/common'

export const Roles = (...roles: string[]) => SetMetadata('roles', roles)
