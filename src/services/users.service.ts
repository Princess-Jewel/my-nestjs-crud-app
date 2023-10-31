import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from '../schema/users.model';

@Injectable({})
export class UsersService {
  // constructor(@InjectModel(Users) private userModel: typeof Users) {}
  // async getAllUsers() {
  //   try {
  //     return await this.userModel.findAll();
  //   } catch (error) {
  //     // Catch the error
  //     console.error('Error fetching users:', error);
  //   }
  // }

  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof Users,
  ) {}

  async findAll(): Promise<Users[]> {
    try {
      return await this.usersRepository.findAll<Users>();
    } catch (error) {
      // Catch the error
      console.error('Error fetching users:', error);
    }
  }
}
