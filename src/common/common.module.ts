import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [ConfigModule],
})
/**
 * 局部中间件
 * @date 2023-06-07
 * @param {any} consumer:MiddlewareConsumer
 * @returns {any}
 */
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // 排除路径
      .exclude({ path: 'login', method: RequestMethod.GET })
      // 监听除了 login 以外的所有路径
      .forRoutes({ path: '*', method: RequestMethod.POST });
  }
}
