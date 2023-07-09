import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
 constructor(private configService: ConfigService) {}
 canActivate(context: ExecutionContext): boolean {
 const request = context.switchToHttp().getRequest();
 const response = context.switchToHttp().getResponse();
 const authHeader = request.headers.authorization;
 if (authHeader) {
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, this.configService.get('JWT_SECRET'));
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




