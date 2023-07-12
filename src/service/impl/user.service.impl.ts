import { Injectable } from '@nestjs/common';
import { R, Res } from 'src/response/R';
import { UserService } from '../user.service';
import { UserPageDto } from 'src/pojo/dto/user.dto';
import { BaseService } from '../Base.service';
import { UserEntity } from 'src/pojo/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserServiceImpl
  extends BaseService<UserEntity>
  implements UserService
{
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  async addUser(user: UserPageDto): Promise<Res> {
    const data = await this.saveOne(user as UserEntity);
    return R.ok('新增成功', data);
  }

  page(currentPage: number, pageSize: number, user: UserPageDto): Promise<Res> {
    return this.findPage(currentPage, pageSize, user);
  }
}
