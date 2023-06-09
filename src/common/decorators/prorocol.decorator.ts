import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 自定义装饰器
 * @date 2023-06-07
 * @param {any} (data:unknown
 * @param {any} ctx:ExecutionContext
 * @returns {any}
 */
export const Protocol = createParamDecorator(
  // (data: unknown, ctx: ExecutionContext) => {
  (defaultValue: string, ctx: ExecutionContext) => {
    console.log('自定义装饰器', { defaultValue });
    const request = ctx.switchToHttp().getRequest();
    return request.protocol;
  },
);
