import { Injectable } from '@nestjs/common';
import { LoginService } from '../login.service';
import { LoginDto } from 'src/pojo/dto/login.dto';
import { R, Res } from 'src/response/R';

@Injectable()
// export class LoginServiceImpl implements LoginService {
//   constructor(
//     @InjectRepository(UserEntity)
//     private readonly userRepository: Repository<UserEntity>,
//     dataSource: DataSource,
//     private readonly authService: AuthServiceImpl,
//   ) {
//     super(dataSource, 'user', UserEntity);
//   }
//   async login(user: LoginDto): Promise<any> {
//     const userOne: UserEntity = await this.findOne({
//       username: user.username,
//     });
//     if (!userOne) {
//       return R.err('用户名不存在');
//     }
//     if (user.password !== userOne.password) {
//       return R.err('密码错误');
//     }
//     const data = await this.authService.getToken(userOne);
//     return data;
//   }
// }
export class LoginServiceImpl implements LoginService {
  login(user: LoginDto): Promise<Res> {
    console.log(user);
    return new Promise((res) => {
      setTimeout(() => {
        res(R.ok('111'));
      }, 2222);
    });
  }
}
