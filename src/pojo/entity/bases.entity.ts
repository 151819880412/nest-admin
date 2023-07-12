import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Formt, FormtToString } from 'src/utils/DateFormt';

export abstract class BasesEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 0 未删除 1 删除
  @Column('int', { default: 0, name: 'del_flag' })
  delFlag: number;

  // 0 启用 1 禁用
  @Column('int', { default: 0 })
  state: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    comment: '创建时间',
    name: 'created_time',
    transformer: {
      to(n) {
        if (!n) {
          return Formt('yyyy-MM-dd HH:mm:ss');
        }
        if (n instanceof Date) {
          return FormtToString(n, 'yyyy-MM-dd HH:mm:ss');
        }
        return n;
      },
      from(n) {
        if (n instanceof Date) {
          return FormtToString(n, 'yyyy-MM-dd HH:mm:ss');
        }
        return n;
      },
    },
  })
  @ApiProperty()
  createdTime: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    comment: '更新时间',
    name: 'updated_time',
    transformer: {
      to(n) {
        if (!n) {
          return Formt('yyyy-MM-dd HH:mm:ss');
        }
        if (n instanceof Date) {
          return FormtToString(n, 'yyyy-MM-dd HH:mm:ss');
        }
        return n;
      },
      from(n) {
        if (n instanceof Date) {
          return FormtToString(n, 'yyyy-MM-dd HH:mm:ss');
        }
        return n;
      },
    },
  })
  @ApiProperty()
  updatedTime: Date;
}
