import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Users } from '../schema/users.model';
import { CreateUserWithoutId } from '../dto/createUser.dto';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersWallets } from 'src/schema/usersWallets.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof Users,
    private jwtService: JwtService,
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
  async signIn(email: string, password: string, res: Response): Promise<void> {
    // First check if email exists in the database
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // NOTE TO SELF:  we choose a property name of sub to hold our userId value to be consistent with JWT standards
      const payload = { sub: user.id, email: user.email };
      // Passwords match, return the payload in the jwt

      const access_token = await this.jwtService.signAsync(payload);

      // Create a wallet for the user after signing in
      // let userWallet = await UsersWallets.findByPk(user.id);
      let userWallet = await UsersWallets.findOne({
        where: {
          userId: user.id,
        },
        include: [Users], // This will include the associated Users model data
      });


      if (!userWallet) {
        // If the user's wallet doesn't exist, create it with the initial balance
        userWallet = await UsersWallets.create({
          userId: user.id,
          email: user.email,
          reference: '',
          currency: '',
          amount: 0.0,
          transactionType: 'credit',
        });
      }
      // I created a new object because i dont want to send the password to the frontend
      const userResponse = {
        id: user.id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        age: user.age,
        // avatar: user.avatar,
        // wallet: user.wallet,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      // Send the response
      res.status(200).json({
        status: 'Success',
        message: 'Authentication successful',
        access_token: access_token,
        user: userResponse,
      });
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
