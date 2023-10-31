
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from '../schema/users.model';
import { CreateUserDto, CreateUserWithoutId } from '../dto/createUser.dto';



@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof Users,
  ) {}


  async create(user: CreateUserWithoutId): Promise<Users> {
    try {
      return await this.usersRepository.create(user);
      // console.log("success creating user")
      // return createdUser;
    } catch (error) {
      // Handle the error
      console.error('Error creating user:', error);
    }
}

}
