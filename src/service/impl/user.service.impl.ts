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
import { MenuEntity } from 'src/pojo/entity/menu.entity';

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
    // 查询用户下所有的角色和菜单(一维)
    const data: UserEntity = await this.findOne({
      where: { id },
      relations: ['roles', 'roles.menus'],
    });

    // 查询用户所有的角色和菜单(树形结构)
    // const user = await this.userRepository
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.roles', 'role')
    //   .leftJoinAndSelect('role.menus', 'menu', 'menu.parentId IS NULL') // 加载直接子菜单，menu.parentId IS NULL表示只加载顶层菜单
    //   .leftJoinAndMapMany(
    //     'menu.children',
    //     'menu.children',
    //     'child_menu',
    //     'child_menu.parentId = menu.id',
    //   )
    //   .leftJoinAndMapMany(
    //     'child_menu.children',
    //     'child_menu.children',
    //     'grandchild_menu',
    //     'grandchild_menu.parentId = child_menu.id',
    //   )
    //   .where('user.id = :id', { id })
    //   .orderBy('menu.sort', 'ASC') // 根据 menu 的 sort 字段降序排列
    //   .addOrderBy('child_menu.sort', 'ASC') // 根据 children 的 sort 字段降序排列
    //   .addOrderBy('grandchild_menu.sort', 'ASC') // 根据 grandchildren 的 sort 字段降序排列（如果有的话）
    //   .getOne();
    // console.log(user);

    function generateTree(data: MenuEntity[]) {
      const map = {};
      const tree: MenuEntity[] = [];

      // 首先，将每个节点的id作为键，存储在一个对象中，方便后续通过id查找节点
      data.forEach((item: MenuEntity) => {
        map[item.id] = {
          ...item,
          children: null,
        };
      });

      // 遍历数据，将每个节点添加到其对应的父节点的children数组中
      data.forEach((item: MenuEntity) => {
        if (item.parentId !== null) {
          if (map[item.parentId].children == null) {
            map[item.parentId].children = [];
          }
          map[item.parentId].children.push(map[item.id]);
        } else {
          // 如果parentId为null，则表示该节点是最上级节点，将其添加到树的数组中
          tree.push(map[item.id]);
        }
      });

      return tree;
    }

    const list: MenuEntity[] = [];
    data.roles.forEach((item: RoleEntity) => {
      item.menus.forEach((item2: MenuEntity) => {
        if (
          list.filter((item3: MenuEntity) => item2.id == item3.id).length == 0
        ) {
          list.push(item2);
        }
      });
    });

    const tree = generateTree(list);
    data['menu'] = tree;

    // 将roles中的menus属性设置为undefined，确保它不再在roles对象上体现
    data.roles.forEach((item: RoleEntity) => {
      item.menus = undefined;
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
