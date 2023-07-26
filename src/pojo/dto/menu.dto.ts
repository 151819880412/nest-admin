import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class MenuDto {
  @ApiProperty({ description: '菜单名', type: String })
  @IsNotEmpty({ message: 'menuName不能为空' })
  @IsString({ message: '参数menuName要求是字符串!' })
  readonly menuName: string;
}

export class MenuPageDto {
  readonly menuName: string;
}
