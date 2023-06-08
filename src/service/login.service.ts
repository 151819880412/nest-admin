import { LoginDto } from 'src/pojo/dto/login.dto';
import { Res } from '../response/R';

export interface LoginService {
  login(user: LoginDto): Promise<Res>;
}
