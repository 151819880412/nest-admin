import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Res as Resp,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { R, Res } from 'src/response/R';
import { FileService } from 'src/service/impl/file.service.impl';
import { Get } from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';
import { MulterFile } from 'multer';

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as fs from 'fs'; // 导入fs模块

@Injectable()
export class FileInterceptorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        // 处理上传成功的逻辑
        console.log('文件上传成功');
      }),
      // 处理上传失败的逻辑
      catchError((error) => {
        console.log('文件上传失败:', error);
        throw error;
      }),
    );
  }
}

@ApiBearerAuth()
@ApiTags('文件')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * 上传文件
   * @date 2023-07-11
   * @param {any}
   * @returns {any}
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // 指定上传文件字段的名称，例如 'file'
  async uploadFile(@UploadedFile() file: MulterFile): Promise<Res> {
    return await this.fileService.uploadFile(file);
  }

  @Get('getFile/:fileId')
  @ApiParam({
    name: 'fileId',
    description: 'fileId',
    example: '1',
  })
  getFile(@Param('fileId') fileId: string): Res {
    console.log(fileId);
    return R.ok('上传成功');
  }

  @Get('test')
  test(): Res {
    // 在这里根据文件名获取文件路径
    const filePath = join('D:', 'aaa.js');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return R.ok('成功', fileContent);
  }
}
