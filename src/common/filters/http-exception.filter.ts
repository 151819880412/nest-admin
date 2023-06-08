/**
 * 全局异常处理
 * @author
 * @date 2023-06-07
 * @param {any} exception:HttpException
 * @param {any} host:ArgumentsHost
 * @returns {any}
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Formt } from 'src/utils/DateFormt';
import { Request, Response } from 'express';
import { R } from 'src/response/R';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log(exception, 111);
    // const status = exception.getStatus
    //   ? exception.getStatus()
    //   : HttpStatus.INTERNAL_SERVER_ERROR;
    const status =
      exception instanceof HttpException
        ? exception.getStatus && exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = exception.getResponse
      ? exception.getResponse()
      : exception.message || '服务异常';
    if (typeof message === 'object') {
      message = message.message;
    }
    const code = getErrorCode(exception);

    if (code === 30001) {
      response.status(200).json(R.err('请重新登录', code));
    } else {
      response.status(status).json({
        code,
        message,
        timestamp: Formt('yyyy-MM-dd HH:mm:ss'),
        path: request.url,
        type: 'error',
      });
    }
    // 记录日志
    // logError(exception, request, message);
  }
}

function getErrorCode(exception: HttpException): number {
  const status =
    exception instanceof HttpException
      ? exception.getStatus && exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  if (status === HttpStatus.UNAUTHORIZED) {
    return 40001;
  }
  if (status === HttpStatus.NOT_FOUND) {
    return 40004;
  }
  if (status === HttpStatus.BAD_REQUEST) {
    return 40000;
  }
  if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
    return 50000;
  }
  return 40000;
}

// function logError(
//   exception: HttpException,
//   request: Request,
//   message: any,
// ): void {
//   const error = {
//     message,
//     stack: exception.stack,
//     params: request.params,
//     query: request.query,
//     body: request.body,
//   };
//   console.error(JSON.stringify(error, null, 2));
// }
