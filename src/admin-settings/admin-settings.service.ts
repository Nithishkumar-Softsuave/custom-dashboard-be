import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Pool as PgPool } from 'pg';
import mysql from 'mysql2/promise';
import * as mssql from 'mssql';
import { DbCredentialsDto } from './admin-settings.dto';
import { ConnectingService } from './connecting.service';
import { InjectModel } from '@nestjs/sequelize';
import { DbStoreModel } from 'src/database/models/db-store.model';

@Injectable()
export class AdminSettingsService {
  private readonly logger = new Logger(AdminSettingsService.name);

  constructor(
    private connectingService: ConnectingService,
    @InjectModel(DbStoreModel)
    private readonly dbStoreModel: typeof DbStoreModel,
  ) {}

  async checkWithCredentials(payload: DbCredentialsDto, req: Request) {
    try {
      const { dbType, ...credential } = payload;

      const dbInstance = await this.connectingService.getDbInstance(
        dbType,
        credential,
      );

      if (dbInstance?.error) {
        return dbInstance.error;
      }

      const dbStore = await this.dbStoreModel.create({
        ...credential,
        dbType,
      });

      return {
        message: 'Test connection successful',
        data: {},
        code: 200,
      };
    } catch (error) {
      this.logger.error(
        'Check connection service catch error :' + error.message,
      );
      throw new HttpException(error.message || 'check connection failed', 400);
    }
  }

  async saveConnection(payload: DbCredentialsDto) {
    try {
      const { dbType, ...credential } = payload;

      const dbInstance = await this.connectingService.getDbInstance(
        dbType,
        credential,
      );

      if (dbInstance?.error) {
        return dbInstance.error;
      }

      return {
        message: 'Test connection successful',
        data: {},
        code: 200,
      };
    } catch (error) {
      this.logger.error(
        'Check connection service catch error :' + error.message,
      );
      throw new HttpException(error.message || 'check connection failed', 400);
    }
  }

  // async testQuery(credentials: DBCredentials) {
  //   const { success, client } = await this.connectWithCredentials(credentials);

  //   if (!success || !client) {
  //     throw new Error('Failed to connect to database.');
  //   }

  //   try {
  //     let result: any;

  //     switch (credentials.dbType) {
  //       case 'postgres':
  //         result = await client.query(
  //           `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
  //         );
  //         break;

  //       case 'mysql':
  //         [result] = await client.query(`SHOW TABLES`);
  //         break;

  //       case 'mssql':
  //         result = await client
  //           .request()
  //           .query(
  //             `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'`,
  //           );
  //         break;

  //       default:
  //         throw new Error(`Unsupported database type: ${credentials.dbType}`);
  //     }

  //     this.logger.log('✅ Query executed successfully');
  //     return {
  //       success: true,
  //       message: 'Database connection and query executed successfully!',
  //       data: result.rows || result.recordset || result,
  //     };
  //   } catch (error) {
  //     this.logger.error('❌ Query execution failed:', error.message);
  //     return {
  //       success: false,
  //       message: 'Query execution failed.',
  //       error: error.message,
  //     };
  //   } finally {
  //     if (credentials.dbType === 'postgres') client.release();
  //     if (credentials.dbType === 'mysql') await client.end();
  //     if (credentials.dbType === 'mssql') await mssql.close();
  //   }
  // }
}
