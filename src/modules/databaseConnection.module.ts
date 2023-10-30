// test.module.ts
import { Module } from '@nestjs/common';
import { DatabaseConnectionController } from '../controllers/databaseConnection.controller';


@Module({
  controllers: [DatabaseConnectionController],
})
export class DatabaseConnectionModule {}
