import { Injectable } from '@nestjs/common';
import { R, Res } from 'src/response/R';
import { UserService } from '../user.service';
import { UserPageDto } from 'src/pojo/dto/user.dto';

@Injectable()
export class UserServiceImpl implements UserService {
  page(
    currentPage: number,
    pageSize: number,
    user: UserPageDto,
  ): Promise<Res<any>> {
    return new Promise((res) => {
      setTimeout(() => {
        res(R.ok('111'));
      }, 2222);
    });
  }
}
