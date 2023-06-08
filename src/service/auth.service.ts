import { UserEntity } from 'src/pojo/entity/user.entity';
import { TokenType } from './impl/auth.service.impl';

export interface AuthService {
  getToken(user: UserEntity): Promise<TokenType>;
}
