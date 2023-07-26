import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MenuEntity } from 'src/pojo/entity/menu.entity';
import { BaseServiceImpl } from './Base.service.impl';
import { MenuService } from '../menu.service';

@Injectable()
export class MenuServiceImpl
  extends BaseServiceImpl<MenuEntity>
  implements MenuService
{
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
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
}
