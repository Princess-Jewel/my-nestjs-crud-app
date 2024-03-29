import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/createUser.dto';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { SignInDto } from 'src/dto/signin.dto';
import { UsersService } from 'src/services/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      // First check if email exists in the database
      const existingUser = await this.usersService.findOne(createUserDto.email);

      if (existingUser) {
        return res
          .status(401)
          .json({
            status: 'Error',
            message: 'User with the same email already exists.',
          });
      }

      const saltOrRounds = 10;
      const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
      // Add the hashed password to createUserDto
      createUserDto.password = hash;
      const createdUser = await this.authService.create(createUserDto);
      // console.log("createdUser", createdUser)
      // I created a new object because i dont want to send the password to the frontend
      const userResponse = {
        id: createdUser.id,
        fname: createdUser.fname,
        lname: createdUser.lname,
        email: createdUser.email,
        age: createdUser.age,
        // avatar: createdUser.avatar,
        // wallet: createdUser.wallet,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      };
      return res.status(201).json({
        status: 'Success',
        message: 'User created successfully',
        user: userResponse,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      // Return an error response with an error message
      return res
        .status(500)
        .json({ message: 'User creation failed', error: error.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    return this.authService.signIn(signInDto.email, signInDto.password, res);
  }
}
