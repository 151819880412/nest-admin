import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginController } from 'src/controller/login.controller';
import { UserEntity } from 'src/pojo/entity/user.entity';
import { AuthModule } from './auth.module';
import { LoginServiceImpl } from 'src/service/impl/login.service.impl';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  controllers: [LoginController],
  providers: [LoginServiceImpl],
})
export class LoginModule {}
