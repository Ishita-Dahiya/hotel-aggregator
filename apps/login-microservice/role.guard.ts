import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);
    if (!roles) {
      return false;
    }
    // const request = context.switchToHttp().getRequest();
    // const response = context.switchToHttp().getResponse();
    // const userRoles = request.headers?.role?.split(',');
    // const validRole = this.validateRoles(roles, userRoles);
    // if (validRole) {
    //   return true;
    // } else {
    //   response.status(401).json({ message: "User doesn't have the permission to do the operation" });
    //   return false;
    // }
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const validRole = this.validateRoles(roles, req.headers.role);
    if (validRole) {
        return true;
      } else {
        throw new ForbiddenException("User doesn't have the permission to do the operation");
      }
  }

  validateRoles(roles: string[], userRoles: string[]) {
    if (userRoles) {
      return roles.some(role => userRoles.includes(role));
    }
    return false;
  }

}
