import {
  Brackets,
  DeleteResult,
  EntityTarget,
  FindOptionsWhere,
  InsertResult,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { fuzzyquery } from 'src/utils/Fuzzyquery';
import { Page, R, Res } from 'src/response/R';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
/**
 * 服务基类,实现一些共有的基本方法,这样就不用每个服务类在写一遍了,直接继承该类即可
 */
@Injectable()
export class BaseQueryBuilderServiceImpl<T> {
  constructor(protected readonly repository: Repository<T>) {}

  /**
   * 分页查询
   * @author
   * @date 2023-07-12
   * @param {any} currentPage:number
   * @param {any} pageSize:number
   * @param {any} data:T|{}
   * @param {any} selectCondition:Array<string>=null
   * @returns {any}
   */
  async findPage<E>(
    currentPage: number,
    pageSize: number,
    // eslint-disable-next-line @typescript-eslint/ban-types
    data: E | {},
    selectCondition: Array<string> = null,
  ): Promise<Page> {
    const result: [T[], number] = await this.repository
      .createQueryBuilder('entity')
      .where(fuzzyquery(data))
      .orderBy(`entity.createdTime`, 'DESC')
      .skip(pageSize * (currentPage - 1))
      .take(pageSize)
      .select(selectCondition)
      .getManyAndCount();
    return { total: result[1], results: result[0] };
  }

  /**
   * 查询单个
   * @date 2022-08-17
   * @param {any} where:|string|((qb:this
   * @returns {any}
   */
  async findOne(
    where:
      | string
      | ((qb: this) => string)
      | Brackets
      | ObjectLiteral
      | ObjectLiteral[],
    parameters?: ObjectLiteral,
  ): Promise<T> {
    const data = await this.repository

      .createQueryBuilder('entity')
      .where(where, parameters)
      .getOne();
    return data;
  }

  async findOneBy(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<T[]> {
    const data = await this.repository
      .createQueryBuilder('entity')
      .where(where)
      .getMany();
    return data;
  }

  /**
   * 关联查询单个
   * @date 2022-08-17
   * @param {any} where:|string|((qb:this
   * @returns {any}
   */
  async relationFindOne(
    where:
      | string
      | ((qb: this) => string)
      | Brackets
      | ObjectLiteral
      | ObjectLiteral[],
    parameters?: ObjectLiteral,
  ): Promise<T> {
    const data = await this.repository

      .createQueryBuilder('entity')
      // .leftJoinAndSelect(Article, 'article', 'user.id = article.createBy')
      .where(where, parameters)
      .getOne();
    return data;
  }

  /**
   * 查询多个
   * @date 2022-08-17
   * @param {any} where:|string|((qb:this
   * @returns {any}
   */
  async findMany(
    entity?: EntityTarget<T>,
    dataSourceStr?: string,
    where?: object,
  ): Promise<any> {
    const data = await this.repository
      .createQueryBuilder(dataSourceStr || 'entity')
      .where(Object.assign({}, { delFlag: 1 }, where))
      .getMany();
    return data;
  }

  /**
   * 保存单个
   * @date 2022-08-17
   * @param {any} where:|string|((qb:this
   * @returns {any}
   */
  async saveOne(entity): Promise<InsertResult> {
    const data = await this.repository
      .createQueryBuilder('entity')
      .insert()
      .into('entity')
      .values(entity)
      .execute();
    return data;
  }

  /**
   * 关联保存
   * @date 2022-08-17
   * @param {any} where:|string|((qb:this
   * @returns {any}
   */
  async relationSaveOne<T>(
    entity: EntityTarget<T>,
    obj: QueryDeepPartialEntity<T>,
  ): Promise<InsertResult> {
    const data = await this.repository
      .createQueryBuilder('entity')
      .insert()
      .into(entity)
      .values(obj)
      .execute();
    return data;
  }

  /**
   * 关联保存
   * @date 2022-08-17
   * @param {any} where:|string|((qb:this
   * @returns {any}
   */
  async relationDelete<T>(
    entity: EntityTarget<T>,
    where:
      | string
      | ((qb: this) => string)
      | Brackets
      | ObjectLiteral
      | ObjectLiteral[],
    parameters?: ObjectLiteral,
  ): Promise<DeleteResult> {
    const data = this.repository
      .createQueryBuilder('entity')
      .delete()
      .from(entity)
      .where(where, parameters)
      .execute();
    return data;
  }

  /**
   * 更新
   * @date 2022-08-17
   * @param {any} values:any
   * @param {any} where:|string|((qb:this
   * @returns {any}
   */
  async update<T>(
    values: any,
    where:
      | string
      | ((qb: this) => string)
      | Brackets
      | ObjectLiteral
      | ObjectLiteral[],
    parameters?: ObjectLiteral,
  ): Promise<Res<T>> {
    const data = await this.repository
      .createQueryBuilder('entity')
      .update()
      .set(values)
      .where(where, parameters)
      .returning('*')
      .execute()
      .then((result) => result.raw[0]);
    if (data) {
      return R.ok('修改成功', data);
    } else {
      return R.err('修改失败');
    }
  }

  // 原始更新方法
  // async update(
  //   values: any,
  //   where:
  //     | string
  //     | ((qb: this) => string)
  //     | Brackets
  //     | ObjectLiteral
  //     | ObjectLiteral[],
  //   parameters?: ObjectLiteral,
  // ): Promise<UpdateResult> {
  //   const data = this.repository
  //     .createQueryBuilder('entity')
  //     .update('entity')
  //     .set(values)
  //     .where(where, parameters)
  //     .execute();
  //   return data;
  // }

  /**
   * 删除
   * @date 2022-08-17
   * @param {any} (qb:this
   * @returns {any}
   */
  async delete(
    where:
      | string
      | ((qb: this) => string)
      | Brackets
      | ObjectLiteral
      | ObjectLiteral[],
    parameters?: ObjectLiteral,
  ): Promise<DeleteResult> {
    const data = this.repository
      .createQueryBuilder('entity')
      .delete()
      .from('entity')
      .where(where, parameters)
      .execute();
    return data;
  }
}
