import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisInstance } from 'src/database/redis';
import { UserEntity } from 'src/pojo/entity/user.entity';
import { AuthService } from '../auth.service';

export type TokenType = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async getToken(user: UserEntity): Promise<TokenType> {
    const payload = { ...user };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '24h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7 days',
    });
    // 实例化 redis
    const redis = await RedisInstance.initRedis('auth.certificate', 0);
    // 将用户信息和 token 存入 redis，并设置失效时间，语法：[key, seconds, value]
    await redis.setex(
      `${user.id}-${user.userName}`,
      60 * 60 * 24,
      `${accessToken}`,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async clearToken(user: UserEntity) {
    const redis = await RedisInstance.initRedis('auth.certificate', 0);
    const key = `${user.id}-${user.userName}`;
    return redis.del(`${key}`);
  }
}
