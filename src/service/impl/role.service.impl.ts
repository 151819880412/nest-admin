import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RoleEntity } from 'src/pojo/entity/role.entity';
import { RoleDto, RolePageDto } from 'src/pojo/dto/role.dto';
import { MenuServiceImpl } from './menu.service.impl';
import { BaseServiceImpl } from './Base.service.impl';
import { Page } from 'src/response/R';
import { RoleService } from '../role.service';

@Injectable()
export class RoleServiceImpl
  extends BaseServiceImpl<RoleEntity>
  implements RoleService
{
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,

    private readonly menuServiceImpl: MenuServiceImpl,
  ) {
    super(roleRepository);
  }

  page(
    currentPage: number,
    pageSize: number,
    user: RolePageDto,
  ): Promise<Page> {
    return this.findPage(currentPage, pageSize, user);
  }

  async queryByIds(ids: string[]): Promise<RoleEntity[]> {
    if (!ids || !Array.isArray(ids) || ids.length == 0) {
      return [];
    }
    const data: RoleEntity[] = await this.findMany({
      where: {
        id: In(ids),
      },
      relations: ['menus'],
    });
    return data;
  }

  async queryById(id: string): Promise<RoleEntity> {
    const data: RoleEntity = await this.findOne({
      where: {
        id,
      },
      relations: ['menus'], // 加载菜单及其子菜单
    });

    return data;
  }

  async add(role: RoleDto): Promise<RoleEntity> {
    const menus = await this.menuServiceImpl.queryByIds(role.menus);

    const newRole = new RoleEntity(role as unknown as RoleEntity);
    newRole.menus = menus || [];

    // 保存角色及关联菜单
    const roles: RoleEntity = await this.roleRepository.save(newRole);
    return roles;
  }

  async updates(role: RoleDto): Promise<RoleEntity> {
    const menus = await this.menuServiceImpl.queryByIds(role.menus);
    const roleToUpdate = await this.roleRepository.findOne({
      where: {
        id: role.id,
      },
    });
    role.menus = menus as unknown as string[];
    Object.assign(roleToUpdate, role);

    // 保存角色及关联菜单
    const roles: RoleEntity = await this.roleRepository.save(roleToUpdate);
    return roles;
  }
}
