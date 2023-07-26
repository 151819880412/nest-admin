import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
export class RoleDto {
  @ApiProperty({ description: '角色名', type: String })
  @IsNotEmpty({ message: 'roleName不能为空' })
  @IsString({ message: '参数roleName要求是字符串!' })
  @Expose()
  roleName: string;

  @ApiProperty({ description: 'id', type: String })
  id?: string;

  // @Exclude() // 该属性不会出现在DTO中
  @Expose()
  @ApiProperty({ description: '菜单' })
  menus?: string[];
}

export class RolePageDto {
  @Expose()
  roleName?: string;
}
