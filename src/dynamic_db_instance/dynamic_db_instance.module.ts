// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { DatabaseController } from './dynamic_db_instance.controller';
import { DynamicDbInstanceService } from './dynamic_db_instance.service';
import { TableReplicationService } from './table-replication.service';

@Module({
  controllers: [DatabaseController],
  providers: [DynamicDbInstanceService, TableReplicationService],
  exports: [DynamicDbInstanceService],
})
export class DynamicDatabaseModule {}
