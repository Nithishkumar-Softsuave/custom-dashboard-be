import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { AirByteServiceModule } from './air_byte_service/air_byte_service.module';
import { EtlModule } from './etl/etl.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
    AirByteServiceModule,
    AirByteServiceModule,
    EtlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
