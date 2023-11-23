import {
  Catch,
  HttpException,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown) {
    const error = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    };

    if (exception instanceof NotFoundException) {
      error.status = exception.getStatus();
      error.message = exception.message;
    } else if (exception instanceof HttpException) {
      error.status = exception.getStatus();
      error.message = exception.message;
    }

    throw new GraphQLError(error.message, {
      extensions: { code: error.status },
    });
  }
}
