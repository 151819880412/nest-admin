import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthServiceImpl } from 'src/service/impl/auth.service.impl';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // PassportModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [],
  providers: [AuthServiceImpl],
  exports: [AuthServiceImpl],
})
export class AuthModule {}
