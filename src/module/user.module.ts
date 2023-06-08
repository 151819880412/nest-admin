import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/pojo/entity/user.entity';
import { UserServiceImpl } from 'src/service/impl/user.service.impl';
import { UserController } from 'src/controller/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserServiceImpl],
})
export class UserModule {}
