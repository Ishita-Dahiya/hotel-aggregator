import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
 constructor(private configService: ConfigService) {}
 canActivate(context: ExecutionContext): boolean {
//  const request = context.switchToHttp().getRequest();
//  const response = context.switchToHttp().getResponse();
const ctx = GqlExecutionContext.create(context);
const { req } = ctx.getContext();
 const authHeader = req.headers.authorization;
 if (authHeader) {
  const token = authHeader.split(' ')[1];
  console.log(token);
  try {
    const decoded = jwt.verify(token, this.configService.get('JWT_SECRET'));
    req['user'] = decoded;
    return true;
  } catch (err) {
    //response.status(401).json({ message: 'Invalid token' });
    throw new ForbiddenException('Invalid token');
  }
} else {
  //response.status(401).json({ message: 'No token provided' });
  throw new ForbiddenException('No token provided');
}
 }
}




