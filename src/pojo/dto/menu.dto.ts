import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
export class MenuDto {
  @ApiProperty({ description: '菜单名', type: String })
  @IsNotEmpty({ message: 'menuName不能为空' })
  @IsString({ message: '参数menuName要求是字符串!' })
  @Expose()
  readonly menuName: string;

  @ApiProperty({ description: 'parentId', type: String })
  @Expose()
  readonly parentId: string;
}

export class MenuPageDto {
  readonly menuName: string;
}
