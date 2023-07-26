import { UserEntity } from 'src/pojo/entity/user.entity';
import { TokenType } from './impl/auth.service.impl';
import { ObjectLiteral, Repository } from 'typeorm';

export interface AuthService {
  getToken(user: UserEntity): Promise<TokenType>;
}
