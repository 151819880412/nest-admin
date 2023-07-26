import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipes } from './common/pipes/validation.pipe';
import {
  ApiTransformInterceptor,
  WarpResponseInterceptor,
} from './common/interceptors/warp-response.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 全局注册 管道 -- 参数过滤器
  app.useGlobalPipes(new ValidationPipes());
  // 全局注册响应拦截器
  // app.useGlobalInterceptors(new WarpResponseInterceptor());
  app.useGlobalInterceptors(new ApiTransformInterceptor(new Reflector()));

  // 全局注册错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 全局守卫
  // app.useGlobalGuards(new JwtAuthGuard(new Reflector()));

  // swagger http://localhost:3000/api
  const options = new DocumentBuilder()
    .setTitle('接口文档')
    .setDescription('接口文档描述')
    .setVersion('1.0')
    // .addTag('cats')
    .addBearerAuth() // 添加 Bearer token 鉴权配置
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
