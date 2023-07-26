import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from 'src/controller/menu.controller';
import { MenuEntity } from 'src/pojo/entity/menu.entity';
import { RoleEntity } from 'src/pojo/entity/role.entity';
import { MenuServiceImpl } from 'src/service/impl/menu.service.impl';

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity, RoleEntity])],
  controllers: [MenuController],
  providers: [MenuServiceImpl],
})
export class MenuModule {}
