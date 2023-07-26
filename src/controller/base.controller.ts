import { Body, Param, Post, UsePipes } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ValidationPipes } from 'src/common/pipes/validation.pipe';
import { Page, R, Res } from 'src/response/R';
import { BaseServiceImpl } from 'src/service/impl/Base.service.impl';

export abstract class BaseController<T> {
  constructor(private readonly service: BaseServiceImpl<T>) {}

  @Post('page/:currentPage/:pageSize')
  @ApiOperation({ summary: 'Post接口', description: '分页' })
  @ApiBody({ type: Object })
  async page(
    @Body() pageDto: object,
    @Param('currentPage') currentPage: number,
    @Param('pageSize') pageSize: number,
  ): Promise<Page> {
    return this.service.findPage(currentPage, pageSize, pageDto);
  }

  @Post('add')
  @UsePipes(new ValidationPipes())
  async add(@Body() data: object): Promise<Awaited<T>> {
    const res: Awaited<T> = await this.service.saveOne(data as unknown as T);
    return res;
  }
}
