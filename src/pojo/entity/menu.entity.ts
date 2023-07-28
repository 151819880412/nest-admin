import {
  Entity,
  Column,
  ManyToMany,
  Index,
  Unique,
  TreeChildren,
  TreeParent,
  Tree,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { BasesEntity } from './bases.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'menu' })
@Unique(['id', 'menuName'])
@Tree('materialized-path')
export class MenuEntity extends BasesEntity {
  @Column('varchar', { length: 20 })
  @IsNotEmpty({ message: 'menuName不能为空' })
  @IsString({ message: '参数menuName要求是字符串!' })
  @Index({ unique: true }) // 唯一索引
  menuName: string;

  @Column({ nullable: true, name: 'route_link', type: 'varchar', length: 20 })
  routeLink: string;

  @Column({ nullable: true, name: 'icon', type: 'varchar', length: 20 })
  icon: string;

  @Column({ nullable: true, name: 'sort', type: 'int4' })
  sort: number;

  @TreeChildren()
  children: MenuEntity[];

  // 启用级联删除
  @TreeParent({ onDelete: 'CASCADE' })
  parent: MenuEntity;

  @Column({ name: 'parent_id', nullable: true })
  @ApiProperty()
  parentId: string;

  @ManyToMany(() => RoleEntity, (role) => role.menus)
  roles: RoleEntity[];
}
