import { Body, Controller, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto, UserPageDto } from 'src/pojo/dto/user.dto';
import { Res } from 'src/response/R';
import { UserServiceImpl } from 'src/service/impl/user.service.impl';

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
  ): Promise<Res> {
    return this.userService.page(currentPage, pageSize, userPageDto);
  }

  @Post('add')
  addUser(@Body() user: UserDto): Promise<Res> {
    return this.userService.addUser(user);
  }
}
