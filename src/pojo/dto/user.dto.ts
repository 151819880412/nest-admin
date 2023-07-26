import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
export class UserDto {
  @ApiProperty({ description: '用户名', type: String })
  @IsNotEmpty({ message: 'username不能为空' })
  @IsString({ message: '参数username要求是字符串!' })
  @Expose()
  readonly userName: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: 'password不能为空' })
  @IsString({ message: '参数password要求是字符串!' })
  @IsString()
  @Expose()
  readonly password: string;

  @ApiProperty({ description: '角色' })
  @Expose()
  roles?: string[];

  @ApiProperty({ description: 'id' })
  @Expose()
  readonly id?: string;
}

export class UserPageDto {
  @Expose()
  readonly userName: string;
}
