import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserPageDto } from 'src/pojo/dto/user.dto';
import { Res } from 'src/response/R';
import { UserServiceImpl } from 'src/service/impl/user.service.impl';

@ApiBearerAuth()
@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserServiceImpl) {}

  /**
   * 分页
   * @date 2022-08-09
   * @param {any} @Body(
   * @returns {any}
   */
  @Post('page/:currentPage/:pageSize')
  page(
    @Body() userPageDto: UserPageDto,
    @Param('currentPage') currentPage: number,
    @Param('pageSize') pageSize: number,
  ): Promise<Res> {
    return this.userService.page(currentPage, pageSize, userPageDto);
  }
}
