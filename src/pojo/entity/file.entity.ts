import { Entity, Column, Index, Unique } from 'typeorm';
import { BasesEntity } from './bases.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'file' })
@Unique(['fileName'])
export class FileEntity extends BasesEntity {
  @Column('varchar', { length: 50, comment: '文件名' })
  @IsNotEmpty({ message: 'fileName不能为空' })
  @IsString({ message: '参数fileName要求是字符串!' })
  @Index({ unique: true }) // 唯一索引
  fileName: string;

  @Column('varchar', { length: 50, comment: '版本' })
  @IsNotEmpty({ message: 'version不能为空' })
  @IsString({ message: '参数version要求是字符串!' })
  @Index({ unique: true }) // 唯一索引
  version: string;

  // constructor(data: FileEntity) {
  //   super();
  //   Object.assign(this, data);
  // }
}
