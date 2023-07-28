import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RoleDto, RolePageDto } from 'src/pojo/dto/role.dto';
import { RoleServiceImpl } from 'src/service/impl/role.service.impl';
import { RoleEntity } from 'src/pojo/entity/role.entity';
import { Page } from 'src/response/R';

@ApiBearerAuth()
@ApiTags('角色')
@Controller('role')
@ApiBearerAuth() // 添加 Bearer Token 认证
export class RoleController {
  constructor(private readonly roleService: RoleServiceImpl) {}

  @Post('page/:currentPage/:pageSize')
  @ApiOperation({ summary: 'Post接口', description: '用户分页' })
  @ApiBody({ type: RolePageDto })
  @ApiParam({
    name: 'currentPage',
    description: '当前页',
    example: '1',
  })
  @ApiParam({
    name: 'pageSize',
    description: '分页条数',
    example: '10',
  })
  page(
    @Body() rolePageDto: RolePageDto,
    @Param('currentPage') currentPage: number,
    @Param('pageSize') pageSize: number,
  ): Promise<Page> {
    return this.roleService.page(currentPage, pageSize, rolePageDto);
  }

  @Get('queryById/:id')
  queryById(@Param('id') id: string): Promise<RoleEntity> {
    return this.roleService.queryById(id);
  }

  @Post('queryByIds')
  queryByIds(@Body() { ids }: { ids: string[] }): Promise<RoleEntity[]> {
    return this.roleService.queryByIds(ids);
  }

  @Post('add')
  add(@Body() role: RoleDto): Promise<RoleEntity> {
    return this.roleService.add(role);
  }

  @Put('update')
  update(@Body() role: RoleDto): Promise<RoleEntity> {
    return this.roleService.updates(role);
  }
}
