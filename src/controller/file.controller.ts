import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { R, Res } from 'src/response/R';
import { FileService } from 'src/service/impl/file.service.impl';
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
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(): Res {
    return R.ok('上传成功');
  }
}
