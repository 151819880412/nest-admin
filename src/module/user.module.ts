import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/pojo/entity/user.entity';
import { UserServiceImpl } from 'src/service/impl/user.service.impl';
import { UserController } from 'src/controller/user.controller';
import { RoleEntity } from 'src/pojo/entity/role.entity';
import { RoleServiceImpl } from 'src/service/impl/role.service.impl';
import { MenuServiceImpl } from 'src/service/impl/menu.service.impl';
import { MenuEntity } from 'src/pojo/entity/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, MenuEntity])],
  controllers: [UserController],
  providers: [UserServiceImpl, RoleServiceImpl, MenuServiceImpl],
})
export class UserModule {}
