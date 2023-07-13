import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from 'src/controller/file.controller';
import { FileService } from 'src/service/impl/file.service.impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/pojo/entity/file.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    // MulterModule.registerAsync({
    //   useClass: FileService,
    // }),
    // MulterModule.register({
    //   storage: diskStorage({
    //     //自定义路径
    //     destination: `./fileUpload/${Formt('yyyy-MM-dd')}`,
    //     filename: (req, file, cb) => {
    //       // 自定义文件名
    //       const filename = Buffer.from(file.originalname, 'latin1').toString(
    //         'utf8',
    //       );
    //       return cb(null, filename);
    //     },
    //   }),
    // }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
