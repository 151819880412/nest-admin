import { RoleDto, RolePageDto } from 'src/pojo/dto/role.dto';
import { RoleEntity } from 'src/pojo/entity/role.entity';
import { Page } from 'src/response/R';

export interface RoleService {
  page(currentPage: number, pageSize: number, user: RolePageDto): Promise<Page>;
  queryByIds(ids: string[]): Promise<RoleEntity[]>;
  add(role: RoleDto): Promise<RoleEntity>;
  updates(role: RoleDto): Promise<RoleEntity>;
}
