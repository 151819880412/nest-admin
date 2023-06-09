import { Injectable } from '@nestjs/common';
import { LoginService } from '../login.service';
import { LoginDto } from 'src/pojo/dto/login.dto';
import { R, Res } from 'src/response/R';
import { JwtService } from '@nestjs/jwt';
import { RedisInstance } from 'src/database/redis';
import { BaseService } from '../Base.service';
import { UserEntity } from 'src/pojo/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LoginServiceImpl
  extends BaseService<UserEntity>
  implements LoginService
{
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity) userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  async login(user: LoginDto): Promise<Res> {
    const payload = { ...user };
    // const data = await this.findOne({
    //   where: {
    //     username: user.username,
    //   },
    // });
    const data = await this.findOneBy('username', user.username);
    console.log(data);
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
      `${user.id}-${user.username}`,
      60 * 60 * 24,
      `${accessToken}`,
    );

    return R.ok('登录成功', {
      accessToken: 'Bearer ' + accessToken,
      refreshToken: 'Bearer ' + refreshToken,
    });
  }
}
