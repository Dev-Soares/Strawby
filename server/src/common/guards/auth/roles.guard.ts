import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // pega o role necessário para acessar a rota, definido no decorator @Roles
        const roles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ])

        if (!roles) return true // se não tiver role definido, libera o acesso

        const request = context.switchToHttp().getRequest()
        const user = request.user

        return roles.includes(user?.role) // verifica se a role do usuário está entre as roles permitidas


    }

}