import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Formt, FormtToString } from 'src/utils/DateFormt';
import { Expose } from 'class-transformer';

export abstract class BasesEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  // 0--删除 1--未删除
  @Column('int', { default: 1, name: 'del_flag' })
  delFlag: number;

  // 0--禁用 1--启用
  @Column('int', { default: 1 })
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

  @UpdateDateColumn({
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
        } else {
          return Formt('yyyy-MM-dd HH:mm:ss');
        }
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
