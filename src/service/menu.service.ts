import { MenuEntity } from 'src/pojo/entity/menu.entity';

export interface MenuService {
  queryByIds(ids: string[]): Promise<MenuEntity[]>;
}
