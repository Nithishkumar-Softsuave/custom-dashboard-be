/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger } from '@nestjs/common';
import { Pool as PgPool } from 'pg';
import mysql from 'mysql2/promise';
import * as mssql from 'mssql';
import { DBType } from './dynamic_db_instance.service';

interface DBCredentials {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  dbType: DBType;
}

@Injectable()
export class TableReplicationService {
  private readonly logger = new Logger(TableReplicationService.name);

  /**
   * Create DB client dynamically based on dbType
   */
  private async connectDB(credentials: DBCredentials) {
    switch (credentials.dbType) {
      case 'postgres':
        return new PgPool({
          host: credentials.host,
          port: credentials.port,
          user: credentials.user,
          password: credentials.password,
          database: credentials.database,
        });
      case 'mysql':
        return mysql.createConnection({
          host: credentials.host,
          port: credentials.port,
          user: credentials.user,
          password: credentials.password,
          database: credentials.database,
        });
      case 'mssql':
        const pool = await mssql.connect({
          user: credentials.user,
          password: credentials.password,
          server: credentials.host,
          port: credentials.port,
          database: credentials.database,
          options: { encrypt: false, trustServerCertificate: true },
        });
        return pool;
      default:
        throw new Error(`Unsupported database type: ${credentials.dbType}`);
    }
  }

  /**
   * Fetch table schema from any supported source DB
   */
  private async getTableSchema(
    client: any,
    dbType: DBType,
    tableName: string,
  ): Promise<any[]> {
    switch (dbType) {
      case 'postgres': {
        const { rows } = await client.query(
          `SELECT column_name, data_type, character_maximum_length, is_nullable
           FROM information_schema.columns
           WHERE table_name = $1`,
          [tableName],
        );
        return rows;
      }
      case 'mysql': {
        const [rows] = await client.query(`DESCRIBE ${tableName}`);
        return rows.map((col: any) => ({
          column_name: col.Field,
          data_type: col.Type,
          is_nullable: col.Null,
        }));
      }
      case 'mssql': {
        const result = await client.request().query(
          `SELECT COLUMN_NAME as column_name, DATA_TYPE as data_type, IS_NULLABLE as is_nullable
             FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`,
        );
        return result.recordset;
      }
    }
  }

  /**
   * Create same table in destination DB using schema
   */
  private async createTableInDestination(
    client: any,
    dbType: DBType,
    tableName: string,
    schema: any[],
  ) {
    const columns = schema
      .map((col) => {
        let dataType = col.data_type || col.Type;
        if (dataType.includes('character varying')) dataType = 'VARCHAR(255)';
        if (dataType.includes('integer')) dataType = 'INT';
        return `${col.column_name} ${dataType} ${
          col.is_nullable === 'NO' ? 'NOT NULL' : ''
        }`;
      })
      .join(', ');

    const createQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns});`;

    switch (dbType) {
      case 'postgres':
        await client.query(createQuery);
        break;
      case 'mysql':
        await client.query(createQuery);
        break;
      case 'mssql':
        await client.request().query(createQuery);
        break;
    }

    this.logger.log(`✅ Table '${tableName}' created in destination DB`);
  }

  /**
   * Copy all data from source to destination
   */
  private async copyTableData(
    sourceClient: any,
    destClient: any,
    dbTypeSrc: DBType,
    dbTypeDest: DBType,
    tableName: string,
  ) {
    let rows: any[] = [];

    // Fetch data from source
    switch (dbTypeSrc) {
      case 'postgres': {
        const { rows: pgRows } = await sourceClient.query(
          `SELECT * FROM ${tableName}`,
        );
        rows = pgRows;
        break;
      }
      case 'mysql': {
        const [mysqlRows] = await sourceClient.query(
          `SELECT * FROM ${tableName}`,
        );
        rows = mysqlRows;
        break;
      }
      case 'mssql': {
        const result = await sourceClient
          .request()
          .query(`SELECT * FROM ${tableName}`);
        rows = result.recordset;
        break;
      }
    }

    if (!rows.length) {
      this.logger.warn(`⚠️ No data found in table ${tableName}`);
      return;
    }

    const columns = Object.keys(rows[0]);
    const insertBase = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES`;

    const values = rows.map((r) => {
      const vals = columns.map((col) =>
        r[col] === null ? 'NULL' : `'${String(r[col]).replace(/'/g, "''")}'`,
      );
      return `(${vals.join(',')})`;
    });

    const insertQuery = insertBase + values.join(',') + ';';

    switch (dbTypeDest) {
      case 'postgres':
        await destClient.query(insertQuery);
        break;
      case 'mysql':
        await destClient.query(insertQuery);
        break;
      case 'mssql':
        await destClient.request().query(insertQuery);
        break;
    }

    this.logger.log(`✅ Copied ${rows.length} rows from ${tableName}`);
  }

  /**
   * Main function: replicate data between two DBs
   */
  async replicateTables(
    source: DBCredentials,
    destination: DBCredentials,
    tables: string[],
  ) {
    const sourceClient = await this.connectDB(source);
    const destClient = await this.connectDB(destination);

    try {
      for (const table of tables) {
        this.logger.log(`🚀 Replicating table: ${table}`);

        // Step 1: Fetch schema
        const schema = await this.getTableSchema(
          sourceClient,
          source.dbType,
          table,
        );

        // Step 2: Create table in destination
        await this.createTableInDestination(
          destClient,
          destination.dbType,
          table,
          schema,
        );

        // Step 3: Copy data
        await this.copyTableData(
          sourceClient,
          destClient,
          source.dbType,
          destination.dbType,
          table,
        );
      }

      return { success: true, message: 'All tables replicated successfully!' };
    } catch (error) {
      this.logger.error(`❌ Replication failed: ${error.message}`);
      return { success: false, message: error.message };
    } finally {
      // Close connections
      if (source.dbType === 'postgres') await sourceClient.end();
      if (destination.dbType === 'postgres') await destClient.end();

      if (source.dbType === 'mysql') await sourceClient.end();
      if (destination.dbType === 'mysql') await destClient.end();

      if (source.dbType === 'mssql') await mssql.close();
    }
  }
}
