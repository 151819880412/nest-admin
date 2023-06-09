import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RedisInstance } from 'src/database/redis';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UserEntity } from '../../pojo/entity/user.entity';

/**
 * 守卫
 * @date 2023-06-07
 * @returns {any}
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    // 获取请求头里的 token
    const token: string = request['headers'].authorization as string;

    if (token) {
      try {
        // 获取 redis 里缓存的 token
        const user: UserEntity = new JwtService().decode(
          token.substring('Bearer '.length),
        ) as UserEntity;
        const key = `${user.id}-${user.username}`;
        const redis_token = await RedisInstance.getRedis(
          'auth.certificate',
          0,
          key,
        );
        if (!redis_token || redis_token !== token) {
          throw new UnauthorizedException('未鉴权,请重新登录');
        }
      } catch (err) {
        console.error(err);
        throw new UnauthorizedException('未鉴权,请重新登录');
      }

      return true;
    }
    throw new UnauthorizedException('未鉴权,请重新登录');
  }
}
