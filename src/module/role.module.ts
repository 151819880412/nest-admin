import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from 'src/controller/role.controller';
import { MenuEntity } from 'src/pojo/entity/menu.entity';
import { RoleEntity } from 'src/pojo/entity/role.entity';
import { UserEntity } from 'src/pojo/entity/user.entity';
import { MenuServiceImpl } from 'src/service/impl/menu.service.impl';
import { RoleServiceImpl } from 'src/service/impl/role.service.impl';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, MenuEntity, UserEntity])],
  controllers: [RoleController],
  providers: [RoleServiceImpl, MenuServiceImpl],
})
export class RoleModule {}
