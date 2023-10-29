// test.module.ts
import { Module } from '@nestjs/common';
import { DatabaseConnectionController } from './databaseConnection.controller';


@Module({
  controllers: [DatabaseConnectionController],
})
export class DatabaseConnectionModule {}
