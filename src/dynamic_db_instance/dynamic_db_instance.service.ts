/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { Pool as PgPool } from 'pg';
import mysql from 'mysql2/promise';
import * as mssql from 'mssql';

export type DBType = 'postgres' | 'mysql' | 'mssql';

interface DBCredentials {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  dbType: DBType;
}

@Injectable()
export class DynamicDbInstanceService {
  private readonly logger = new Logger(DynamicDbInstanceService.name);

  private connections = new Map<string, any>();

  async connectWithCredentials(credentials: DBCredentials) {
    try {
      let client: any;

      switch (credentials.dbType) {
        case 'postgres': {
          const pool = new PgPool({
            host: credentials.host,
            port: credentials.port,
            user: credentials.user,
            password: credentials.password,
            database: credentials.database,
          });
          client = await pool.connect();
          this.connections.set('postgres', pool);
          this.logger.log('✅ PostgreSQL connection successful');
          break;
        }

        case 'mysql': {
          client = await mysql.createConnection({
            host: credentials.host,
            port: credentials.port,
            user: credentials.user,
            password: credentials.password,
            database: credentials.database,
          });
          this.connections.set('mysql', client);
          this.logger.log('✅ MySQL connection successful');
          break;
        }

        case 'mssql': {
          const pool = await mssql.connect({
            user: credentials.user,
            password: credentials.password,
            server: credentials.host,
            port: credentials.port,
            database: credentials.database,
            options: {
              encrypt: false,
              trustServerCertificate: true,
            },
          });
          client = pool;
          this.connections.set('mssql', pool);
          this.logger.log('✅ MSSQL connection successful');
          break;
        }

        default:
          throw new Error(`Unsupported database type: ${credentials.dbType}`);
      }

      return { success: true, client };
    } catch (error) {
      this.logger.error(`DB connection failed: ${error.message}`);
      return {
        success: false,
        message: 'Database connection failed.',
        error: error.message,
      };
    }
  }

  async testQuery(credentials: DBCredentials) {
    const { success, client } = await this.connectWithCredentials(credentials);

    if (!success || !client) {
      throw new Error('Failed to connect to database.');
    }

    try {
      let result: any;

      switch (credentials.dbType) {
        case 'postgres':
          result = await client.query(
            `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
          );
          break;

        case 'mysql':
          [result] = await client.query(`SHOW TABLES`);
          break;

        case 'mssql':
          result = await client
            .request()
            .query(
              `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'`,
            );
          break;

        default:
          throw new Error(`Unsupported database type: ${credentials.dbType}`);
      }

      this.logger.log('✅ Query executed successfully');
      return {
        success: true,
        message: 'Database connection and query executed successfully!',
        data: result.rows || result.recordset || result,
      };
    } catch (error) {
      this.logger.error('❌ Query execution failed:', error.message);
      return {
        success: false,
        message: 'Query execution failed.',
        error: error.message,
      };
    } finally {
      if (credentials.dbType === 'postgres') client.release();
      if (credentials.dbType === 'mysql') await client.end();
      if (credentials.dbType === 'mssql') await mssql.close();
    }
  }
}
