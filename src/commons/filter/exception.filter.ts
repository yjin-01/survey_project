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

    console.log('?????', typeof exception);

    if (exception instanceof NotFoundException) {
      error.status = 404;
      error.message = '잘못된 페이지 요청';
    } else if (exception instanceof HttpException) {
      error.status = exception.getStatus();
      error.message = exception.message;

      throw new GraphQLError(error.message, {
        extensions: { code: error.status },
      });
    } else {
      throw new GraphQLError(error.message, {
        extensions: { code: error.status },
      });
    }

    console.log('============');
    console.log('예외가 발생했어요!');
    console.log('예외내용: ', error.message);
    console.log('예외코드: ', error.status);
    console.log('============');
  }
}
