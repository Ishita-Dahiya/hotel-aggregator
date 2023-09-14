import { Catch, ArgumentsHost } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';

@Catch()
export class GraphqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof NotFoundException) {
      return 'User not found';
    }
    // Handle other exception types and return appropriate messages
    return 'Internal server error';
  }
}
