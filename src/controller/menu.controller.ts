import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MenuDto } from 'src/pojo/dto/menu.dto';
import { MenuEntity } from 'src/pojo/entity/menu.entity';
import { MenuServiceImpl } from 'src/service/impl/menu.service.impl';

@ApiBearerAuth()
@ApiTags('菜单')
@Controller('menu')
@ApiBearerAuth()
export class MenuController {
  constructor(private readonly menuService: MenuServiceImpl) {}

  @Post('add')
  add(@Body() role: MenuDto): Promise<MenuEntity> {
    return this.menuService.add(role);
  }

  @Get('queryById/:id')
  queryById(@Param('id') id: string): Promise<MenuEntity> {
    return this.menuService.queryById(id);
  }
}
