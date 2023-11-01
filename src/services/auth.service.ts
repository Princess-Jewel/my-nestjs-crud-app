import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Users } from '../schema/users.model';
import { CreateUserWithoutId } from '../dto/createUser.dto';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof Users,
  ) {}

  async create(user: CreateUserWithoutId): Promise<Users> {
    try {
      return await this.usersRepository.create(user);
    } catch (error) {
      // Handle the error and throw a meaningful exception
      console.error('Error creating user:', error);
      throw new Error('Failed to create a user.');
    }
  }

  // This is for the signin part
  async signIn(email: string, password: string): Promise<any> {
    // First check if email exists in the database
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Passwords match, return the user
      return user;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
