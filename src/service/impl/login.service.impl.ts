import { Injectable } from '@nestjs/common';
import { LoginService } from '../login.service';
import { LoginDto } from 'src/pojo/dto/login.dto';
import { R, Res } from 'src/response/R';
import { JwtService } from '@nestjs/jwt';
import { RedisInstance } from 'src/database/redis';
import { BaseServiceImpl } from './Base.service.impl';
import { UserEntity } from 'src/pojo/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LoginServiceImpl
  extends BaseServiceImpl<UserEntity>
  implements LoginService
{
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity) userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  async login(data: LoginDto): Promise<Res> {
    const user = await this.findOne({
      where: {
        userName: data.userName,
      },
      relations: ['roles', 'roles.menus'],
    });
    console.log(user);
    if (!user) {
      return R.err('用户不存在');
    }
    const payload = { ...user };

    // 提取roles中的menus字段，放入单独的数组中
    const menusArray = user.roles.map((role) => role.menus);
    // 使用reduce将menusArray合并为一维数组
    const flattenedMenus = menusArray.reduce(
      (acc, menus) => acc.concat(menus),
      [],
    );
    user['menus'] = flattenedMenus;

    // 将roles中的menus属性设置为null，确保它不再在roles对象上体现
    user.roles.forEach((role) => {
      role.menus = null;
    });

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '24h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7 days',
    });
    console.log(user);
    // 实例化 redis
    const redis = await RedisInstance.initRedis('auth.certificate', 0);
    // 将用户信息和 token 存入 redis，并设置失效时间，语法：[key, seconds, value]
    await redis.setex(
      `${user.id}-${user.userName}`,
      60 * 60 * 24,
      `${accessToken}`,
    );

    return R.ok('登录成功', {
      accessToken: 'Bearer ' + accessToken,
      refreshToken: 'Bearer ' + refreshToken,
      user,
    });
  }
}
