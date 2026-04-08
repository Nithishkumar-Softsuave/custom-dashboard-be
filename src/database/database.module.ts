import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { UserModel } from './models/user.model';
import { DbStoreModel } from './models/db-store.model';
import { RoleModel } from './models/role.model';
import { OrgModel } from './models/org.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        models: [UserModel, DbStoreModel, RoleModel, OrgModel],
        query: { raw: true },
        synchronize: false,
        logging: false,
        autoLoadModels: true,
      }),
    }),
    SequelizeModule.forFeature([UserModel, DbStoreModel, RoleModel, OrgModel]),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private sequelize: Sequelize) {}

  async onModuleInit() {
    try {
      await this.sequelize.sync({ force: false });
      Logger.log('Database connected and synchronized');
    } catch (error) {
      Logger.error('Error synchronizing database:', error);
    }
  }
}
