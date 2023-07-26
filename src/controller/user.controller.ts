import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto, UserPageDto } from 'src/pojo/dto/user.dto';
import { UserEntity } from 'src/pojo/entity/user.entity';
import { Page, Res } from 'src/response/R';
import { UserServiceImpl } from 'src/service/impl/user.service.impl';
import { InsertResult } from 'typeorm';

@ApiBearerAuth()
@ApiTags('用户')
@Controller('user')
@ApiBearerAuth() // 添加 Bearer Token 认证
export class UserController {
  constructor(private readonly userService: UserServiceImpl) {}

  /**
   * 分页
   * @date 2022-08-09
   * @param {any} @Body(
   * @returns {any}
   */
  @Post('page/:currentPage/:pageSize')
  @ApiOperation({ summary: 'Post接口', description: '用户分页' })
  @ApiBody({ type: UserPageDto })
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
    @Body() userPageDto: UserPageDto,
    @Param('currentPage') currentPage: number,
    @Param('pageSize') pageSize: number,
  ): Promise<Page> {
    return this.userService.page(currentPage, pageSize, userPageDto);
  }

  @Post('add')
  addUser(@Body() user: UserDto): Promise<UserEntity> {
    return this.userService.addUser(user);
  }

  @Get('queryById/:id')
  queryById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.queryById(id);
  }

  @Put('update')
  update(@Body() user: UserDto): Promise<UserEntity> {
    return this.userService.updates(user);
  }
}
