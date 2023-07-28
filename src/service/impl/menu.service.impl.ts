import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, TreeRepository } from 'typeorm';
import { MenuEntity } from 'src/pojo/entity/menu.entity';
import { BaseServiceImpl } from './Base.service.impl';
import { MenuService } from '../menu.service';
import { MenuDto } from 'src/pojo/dto/menu.dto';

@Injectable()
export class MenuServiceImpl
  extends BaseServiceImpl<MenuEntity>
  implements MenuService
{
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
    @InjectRepository(MenuEntity)
    private readonly menuTreeRepository: TreeRepository<MenuEntity>,
  ) {
    super(menuRepository);
  }

  async queryByIds(ids: string[]): Promise<MenuEntity[]> {
    if (!ids || !Array.isArray(ids) || ids.length == 0) {
      return [];
    }
    const data: MenuEntity[] = await this.findMany({
      where: {
        id: In(ids),
      },
    });
    return data;
  }

  async queryById(id: string): Promise<MenuEntity> {
    const parent: MenuEntity = await this.findOne({
      where: {
        id,
      },
    });
    const data: MenuEntity = await this.menuTreeRepository.findDescendantsTree(
      parent,
    );
    return data;
  }

  async add(menu: MenuDto): Promise<MenuEntity> {
    if (menu.parentId) {
      const parentMenu = await this.menuRepository.findOne({
        where: {
          id: menu.parentId,
        },
      });
      menu['parent'] = parentMenu;
    }
    const data = await this.menuRepository.save(menu);
    return data;
  }
}
