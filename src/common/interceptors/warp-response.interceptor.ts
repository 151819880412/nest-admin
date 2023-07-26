import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { R, Res } from 'src/response/R';
import { Reflector } from '@nestjs/core';
interface ResponseInterFace<T> {
  data: T;
}

/**
 * 拦截器
 * @date 2023-06-07
 * @returns {any}
 */
@Injectable()
export class WarpResponseInterceptor<T extends ResponseInterFace<T>>
  implements NestInterceptor<T, ResponseInterFace<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseInterFace<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    // const response = context.switchToHttp().getResponse<Response>();  response.statusCode 报错
    const response = context.switchToHttp().getResponse();
    if (response.statusCode === 201) {
      context.switchToHttp().getResponse().status(200);
    }
    return next.handle().pipe(
      map((data) => {
        console.log('拦截器', data);
        // return { data, code: 20000, message: '请求成功' };
        if (data.constructor == Res) {
          return data;
        } else {
          return R.ok('请求成功', data);
        }
      }),
    );
  }
}

/**
 * 统一处理返回接口结果，如果不需要则添加@Keep装饰器
 */
export class ApiTransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const keep = this.reflector.get<boolean>(
          'common:transform_keep',
          context.getHandler(),
        );
        if (keep) {
          if (data.constructor == Res) {
            return data.data;
          }
          return data;
        } else {
          const response = context.switchToHttp().getResponse();
          response.header('Content-Type', 'application/json; charset=utf-8');
          if (data.constructor == Res) {
            return data;
          }
          return R.ok('请求成功', data);
        }
      }),
    );
  }
}
