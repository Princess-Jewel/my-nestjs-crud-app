import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from 'src/schema/users.model';

@Injectable({})
export class UsersService {
  constructor(@InjectModel(Users) private userModel: typeof Users) {}
  async getAllUsers() {
    try {
      return await this.userModel.findAll();
    } catch (error) {
      // Catch the error
      console.error('Error fetching users:', error);
    }
  }
}
