import { UserDto, UserPageDto } from 'src/pojo/dto/user.dto';
import { Page } from '../response/R';
import { UserEntity } from 'src/pojo/entity/user.entity';
import { InsertResult } from 'typeorm';

export interface UserService {
  addUser(user: UserPageDto): Promise<UserEntity>;
  page(currentPage: number, pageSize: number, user: UserPageDto): Promise<Page>;
  queryById(id: string): Promise<UserEntity>;
  updates(user: UserDto): Promise<UserEntity>;
}
