import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginController } from 'src/controller/login.controller';
import { UserEntity } from 'src/pojo/entity/user.entity';
import { LoginServiceImpl } from 'src/service/impl/login.service.impl';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [LoginController],
  providers: [LoginServiceImpl],
})
export class LoginModule {}
