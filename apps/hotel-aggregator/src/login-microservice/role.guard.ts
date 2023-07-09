import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
 canActivate(context: ExecutionContext): boolean {
  const roles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);
  if (!roles) {
    return false;
  }

 const request = context.switchToHttp().getRequest();
 const response = context.switchToHttp().getResponse();
 const userRoles = request.headers?.role?.split(',');
 const validRole =  this.validateRoles(roles, userRoles);
 if (validRole) {
  return true;
 } else {
  response.status(401).json({ message: "User doesn't have the permission to do the operation" });
  return false;
 }
 }

 validateRoles(roles: string[], userRoles: string[]) {
  if (userRoles) {
    return roles.some(role => userRoles.includes(role));
  }
  return false;
}

}




