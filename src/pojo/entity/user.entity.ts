import { IsNotEmpty, IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BasesEntity } from './bases.entity';

/**
 * PrimaryGeneratedColumn 主键
 * nullable   可以为空
 * @Entity()  表示 TypeScript 类和数据库表之间的关系
 * @date 2023-06-07
 * @returns {any}
 */
@Entity({ name: 'user' })
@Unique(['id', 'username'])
export class UserEntity extends BasesEntity {
  @Column('varchar', { length: 20 })
  @IsNotEmpty({ message: 'username不能为空' })
  @IsString({ message: '参数username要求是字符串!' })
  @Index({ unique: true }) // 唯一索引
  username: string;

  @Column('varchar', { length: 20 })
  @IsNotEmpty({ message: 'username不能为空' })
  @IsString({ message: '参数username要求是字符串!' })
  password: string;
}
