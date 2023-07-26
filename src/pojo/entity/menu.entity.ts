import { Entity, Column, ManyToMany, Index, Unique } from 'typeorm';
import { RoleEntity } from './role.entity';
import { BasesEntity } from './bases.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'menu' })
@Unique(['id', 'menuName'])
export class MenuEntity extends BasesEntity {
  @Column('varchar', { length: 20 })
  @IsNotEmpty({ message: 'menuName不能为空' })
  @IsString({ message: '参数menuName要求是字符串!' })
  @Index({ unique: true }) // 唯一索引
  menuName: string;

  @ManyToMany(() => RoleEntity, (role) => role.menus)
  roles: RoleEntity[];
}
