import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MenuServiceImpl } from 'src/service/impl/menu.service.impl';

@ApiBearerAuth()
@ApiTags('菜单')
@Controller('menu')
@ApiBearerAuth()
export class MenuController {
  constructor(private readonly menuService: MenuServiceImpl) {}
}
