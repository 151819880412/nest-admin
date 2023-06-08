import { Module } from '@nestjs/common';
import { CoreModule } from './config/core';
import { database } from './config/database';
import { StatusMonitorModule } from 'nest-status-monitor';
import statusMonitorConfig from './config/statusMonitor';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    // 中间件
    CommonModule,
    // 异常监控
    StatusMonitorModule.setUp(statusMonitorConfig),
    // 数据库连接
    CoreModule.forRoot(database()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // 全局中间件
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(LoggerMiddleware)
  //     // 排除路径
  //     .exclude({ path: 'login', method: RequestMethod.GET })
  //     // 监听路径
  //     .forRoutes('login');
  // }
}
