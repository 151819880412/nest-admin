import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * 中间件
 * @author
 * @date 2023-06-07
 * @param {any} req:Request
 * @param {any} res:Response
 * @param {any} next:NextFunction
 * @returns {any}
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 判断是前端调用还是内部调用，内部调用的话直接返回data
    // 检查是否有 X-Requested-With 请求头
    const isFrontendCall = req.headers['x-requested-with'] === 'XMLHttpRequest';
    // 将这个标识存储在请求对象中，以便后续的处理程序使用
    req['isFrontendCall'] = isFrontendCall;
    // 记录日志
    console.log('中间件调用');
    next();
  }
}
