import { Injectable } from '@nestjs/common';
import { Page } from 'src/response/R';
import { UserService } from '../user.service';
import { UserDto, UserPageDto } from 'src/pojo/dto/user.dto';
import { UserEntity } from 'src/pojo/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from 'src/pojo/entity/role.entity';
import { RoleServiceImpl } from './role.service.impl';
import { BaseServiceImpl } from './Base.service.impl';

@Injectable()
export class UserServiceImpl
  extends BaseServiceImpl<UserEntity>
  implements UserService
{
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,

    private readonly roleServiceImpl: RoleServiceImpl,
  ) {
    super(userRepository);
  }

  async addUser(user: UserDto): Promise<UserEntity> {
    const roles = await this.roleServiceImpl.queryByIds(user.roles);
    const newUser = user as unknown as UserEntity;
    newUser.roles = roles;
    // 保存用户及角色
    const users: UserEntity = await this.userRepository.save(newUser);
    return users;
  }

  page(
    currentPage: number,
    pageSize: number,
    user: UserPageDto,
  ): Promise<Page> {
    return this.findPage(currentPage, pageSize, user);
  }

  async queryById(id: string): Promise<UserEntity> {
    const data: UserEntity = await this.findOne({
      where: { id },
      relations: ['roles', 'roles.menus'],
    });
    // 提取roles中的menus字段，放入单独的数组中
    const menusArray = data.roles.map((role) => role.menus);
    data['menus'] = menusArray;

    // 将roles中的menus属性设置为null，确保它不再在roles对象上体现
    data.roles.forEach((role) => {
      role.menus = null;
    });

    return data;
  }

  /**
   * 创建用户及关联角色
   * @author
   * @date 2023-07-20
   * @param {any} user:UserDto
   * @returns {any}
   */
  async updates(user: UserDto): Promise<UserEntity> {
    const roles = await this.roleServiceImpl.queryByIds(user.roles);
    const roleToUpdate = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
    });
    user.roles = roles as unknown as string[];
    Object.assign(roleToUpdate, user);
    // 更新用户及角色
    const users: UserEntity = await this.userRepository.save(roleToUpdate);
    return users;
  }
}
