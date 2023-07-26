// role.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  Index,
  Unique,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { BasesEntity } from './bases.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { MenuEntity } from './menu.entity';

@Entity({ name: 'role' })
@Unique(['id', 'roleName'])
export class RoleEntity extends BasesEntity {
  @Column('varchar', { length: 20 })
  @IsNotEmpty({ message: 'roleName不能为空' })
  @IsString({ message: '参数roleName要求是字符串!' })
  @Index({ unique: true }) // 唯一索引
  roleName: string;

  @ManyToMany(() => UserEntity)
  @JoinTable({ name: 'user_role' })
  users: UserEntity[];

  @ManyToMany(() => MenuEntity, (user) => user.roles)
  @JoinTable({ name: 'role_menu' })
  menus: MenuEntity[];

  constructor(partial: Partial<RoleEntity>) {
    super();
    Object.assign(this, partial);
  }
}
