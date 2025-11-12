// src/database/database.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import {
  DBType,
  DynamicDbInstanceService,
} from './dynamic_db_instance.service';
import { TableReplicationService } from './table-replication.service';

@Controller('dynamic-database')
export class DatabaseController {
  constructor(
    private readonly dbService: DynamicDbInstanceService,
    private readonly replicationService: TableReplicationService,
  ) {}

  @Post('test-connection')
  async testConnection(
    @Body()
    credentials: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
      dbType: DBType;
    },
  ) {
    return await this.dbService.connectWithCredentials(credentials);
  }

  @Post('create-connection')
  async createConnection(
    @Body()
    credentials: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
      dbType: DBType;
    },
  ) {
    return await this.dbService.testQuery(credentials);
  }

  @Post('replicate-tables')
  async replicateTables(
    @Body()
    body: {
      source: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        dbType: DBType;
      };
      destination: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        dbType: DBType;
      };
      tables: string[];
    },
  ) {
    return await this.replicationService.replicateTables(
      body.source,
      body.destination,
      body.tables,
    );
  }
}
