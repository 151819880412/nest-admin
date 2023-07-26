import {
  Repository,
  DeleteResult,
  SaveOptions,
  FindOptionsWhere,
  RemoveOptions,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { fuzzyquery } from 'src/utils/Fuzzyquery';
import { Page } from 'src/response/R';

@Injectable()
/**
 * 服务基类,实现一些共有的基本方法,这样就不用每个服务类在写一遍了,直接继承该类即可
 * 使用比较复杂，需要自己构建where语句
 * @author
 * @date 2023-06-08
 * @param {any} protectedreadonlyrepository:Repository<T>
 * @returns {any}
 */
export class BaseServiceImpl<T> {
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
  async findPag1e<E>(
    currentPage: number,
    pageSize: number,
    // eslint-disable-next-line @typescript-eslint/ban-types
    data: E | {},
    selectCondition: Array<string> = null,
  ): Promise<{ total: number; results: T[] }> {
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

  async findPage(currrentPage = 1, pageSize = 10, data: any) {
    const options = {
      where: fuzzyquery(data),
      order: {
        createdTime: 'DESC',
      },
      take: pageSize,
      skip: (currrentPage - 1) * pageSize,
    } as unknown as FindManyOptions<T>;
    const [result, totalCount]: [T[], number] =
      await this.repository.findAndCount(options);
    const res: Page = {
      total: totalCount,
      results: result,
    };
    return res;
  }

  async saveOne(entity: T, options?: SaveOptions): Promise<T> {
    return this.repository.save(entity, options);
  }

  async saveMany(entities: T[], options?: SaveOptions): Promise<T[]> {
    return this.repository.save(entities, options);
  }

  async findOne(options?: FindOneOptions<T>): Promise<T | undefined> {
    return this.repository.findOne(options);
  }

  async findMany(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async removeOne(entity: T, options?: RemoveOptions): Promise<T> {
    await this.repository.remove(entity, options);
    return entity;
  }

  async removeMany(entities: T[], options?: RemoveOptions): Promise<T[]> {
    await this.repository.remove(entities, options);
    return entities;
  }

  async delete(options?: FindOptionsWhere<T>): Promise<DeleteResult> {
    return this.repository.delete(options);
  }
  async update(
    options: FindOneOptions<T>,
    data: Partial<T>,
  ): Promise<T | undefined> {
    const entity = await this.repository.findOne(options);
    if (!entity) {
      return undefined;
    }
    Object.assign(entity, data);
    await this.repository.save(entity);
    return entity;
  }

  // 再次封装
  async saveOneBy(entity: T, options?: SaveOptions): Promise<T> {
    return this.repository.save(entity, options);
  }

  async saveManyBy(entities: T[], options?: SaveOptions): Promise<T[]> {
    return this.repository.save(entities, options);
  }

  async findOneBy(
    condition: string,
    data: string | number | any,
  ): Promise<T | undefined> {
    const obj: FindOneOptions = {
      where: {
        [condition]: data,
      },
    };
    return this.repository.findOne(obj);
  }

  async findManyBy(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findAllBy(): Promise<T[]> {
    return this.repository.find();
  }

  async removeOneBy(entity: T, options?: RemoveOptions): Promise<T> {
    await this.repository.remove(entity, options);
    return entity;
  }

  async removeManyBy(entities: T[], options?: RemoveOptions): Promise<T[]> {
    await this.repository.remove(entities, options);
    return entities;
  }

  async deleteBy(options?: FindOptionsWhere<T>): Promise<DeleteResult> {
    return this.repository.delete(options);
  }
  async updateBy(
    options: FindOneOptions<T>,
    data: Partial<T>,
  ): Promise<T | undefined> {
    const entity = await this.repository.findOne(options);
    if (!entity) {
      return undefined;
    }
    Object.assign(entity, data);
    await this.repository.save(entity);
    return entity;
  }
}
