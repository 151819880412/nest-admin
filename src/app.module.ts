import { Module } from '@nestjs/common';
import { CoreModule } from './config/core';
import { database } from './config/database';
import { StatusMonitorModule } from 'nest-status-monitor';
import { ConfigModule } from '@nestjs/config';
import statusMonitorConfig from './config/statusMonitor';
import { CommonModule } from './common/common.module';
import { LoginModule } from './module/login.module';
import { UserModule } from './module/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/auth.guard';
import { FileModule } from './module/file.module';
import appConfig from './config/app.config';
import { AuthModule } from './module/auth.module';
import { RoleModule } from './module/role.module';
import { MenuModule } from './module/menu.module';

@Module({
  imports: [
    // 用户
    UserModule,
    // 角色
    RoleModule,
    // 菜单
    MenuModule,
    // 登陆
    LoginModule,
    // 文件
    FileModule,
    // 中间件
    CommonModule,
    // 异常监控
    StatusMonitorModule.setUp(statusMonitorConfig),
    // 权限
    AuthModule,
    // 全局配置
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    // 数据库连接
    CoreModule.forRoot(database()),
  ],
  controllers: [],
  providers: [
    // 守卫token验证
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
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
