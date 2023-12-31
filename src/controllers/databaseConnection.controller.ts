import { Controller, Get } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Controller('test')
export class DatabaseConnectionController {
  constructor(private readonly sequelize: Sequelize) {}

  @Get('test-database')
  async testDatabase() {
    try {
      // This is how i check whether or not the database connection is successful
      const result = await this.sequelize.query('SELECT 1');
      // Log successful database connection
      console.log('Database connection test successful!');
      return 'Database connection test successful!';
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }
}
