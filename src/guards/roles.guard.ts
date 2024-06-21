import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { rolesEnum } from '@prisma/client';

const ROLES = Object.values(rolesEnum);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: typeof ROLES =
      this.reflector.get<typeof ROLES>('roles', context.getHandler()) || [];
    const request = context.switchToHttp().getRequest();
    const canActivate: boolean = roles.length
      ? !!roles.find((role) => request.user.role === role)
      : true;
    return canActivate;
  }
}
