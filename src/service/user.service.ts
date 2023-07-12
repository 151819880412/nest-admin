import { UserPageDto } from 'src/pojo/dto/user.dto';
import { Res } from '../response/R';

export interface UserService {
  page(currentPage: number, pageSize: number, user: UserPageDto): Promise<Res>;
  addUser(user: UserPageDto): Promise<Res>;
}
