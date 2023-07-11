import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/pojo/entity/user.entity';
import { DataSource } from 'typeorm';
import { BaseQueryBuilderService } from '../BaseQuery.service';
import { R } from 'src/response/R';
import { createWriteStream } from 'fs';
import { join } from 'path';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import * as multer from 'multer';
import { Formt } from 'src/utils/DateFormt';
@Injectable()
export class FileService
  extends BaseQueryBuilderService<UserEntity>
  implements MulterOptionsFactory
{
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multer.diskStorage({
        //自定义路径
        destination: `./fileUpload/${Formt('yyyy-MM-dd')}`,
        filename: (req, file, cb) => {
          // 自定义文件名
          const filename = Buffer.from(file.originalname, 'latin1').toString(
            'utf8',
          );
          return cb(null, filename);
        },
      }),
    };
  }
}
