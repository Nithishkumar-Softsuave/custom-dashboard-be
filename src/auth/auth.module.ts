import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from './auth.middleware';
import { DatabaseModule } from 'src/database/database.module';
// import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'afda',
      signOptions: { expiresIn: '1h' },
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/signin', method: RequestMethod.POST },
      )
      .forRoutes({ path: '/*path', method: RequestMethod.ALL });
  }
}

// @Module({
//   imports: [
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'afda',
//       signOptions: { expiresIn: '1h' },
//     }),
//     DatabaseModule,
//     PassportModule,
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, JwtStrategy],
//   exports: [AuthService, JwtModule],
// })
// export class AuthModule {}
