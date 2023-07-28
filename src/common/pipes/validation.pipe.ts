import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
// import { Logger } from '../utils/log4js';

/**
 * 管道 : 验证前端传递的参数
 * 使用 : @UsePipes(new ValidationPipes())
 * @date 2023-06-7
 * @returns {any}
 */
@Injectable()
export class ValidationPipes implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // console.log(metatype, metatype.name, this.toValidate(metatype), value);
    if (!metatype || !this.toValidate(metatype)) {
      // 如果没有传入验证规则，则不验证，直接返回数据
      return value;
    }

    // 将对象转换为 Class 来验证
    const object = plainToClass(metatype, value, {
      excludeExtraneousValues: true, // 添加此选项来过滤未@Expose()定义的属性
    });
    // console.log(object, JSON.parse(JSON.stringify(object)));
    const errors = await validate(object);
    if (errors.length > 0) {
      const errorArr = [];
      Object.values(errors).forEach((item) => {
        errorArr.push(item.constraints);
      });
      // const msg = Object.values(errors[0].constraints)[0]; // 只需要取第一个错误信息并返回即可
      // Logger.error(`Validation failed: ${msg}`);
      // throw new BadRequestException(`Validation failed: ${msg}`);
      throw new BadRequestException(errorArr);
    }
    return object;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
