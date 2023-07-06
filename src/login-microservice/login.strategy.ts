import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from './constants';




@Injectable()
export class AuthGuard implements CanActivate {
 constructor(private reflector: Reflector) {}
 canActivate(context: ExecutionContext): boolean {
 const request = context.switchToHttp().getRequest();
 const response = context.switchToHttp().getResponse();
 const authHeader = request.headers.authorization;
 if (authHeader) {
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtConstants.secret);
    request['user'] = decoded;
    return true;
  } catch (err) {
    response.status(401).json({ message: 'Invalid token' });
    return false;
  }
} else {
  response.status(401).json({ message: 'No token provided' });
  return false;
}
 }
}




