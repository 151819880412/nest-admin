import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
export class LoginDto {
  @ApiProperty({ description: '用户名', default: '1', type: String })
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

  readonly id: string;
}

export class UserPageDto {
  readonly userName: string;
}
