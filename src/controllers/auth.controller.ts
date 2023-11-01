import { Controller, Post, Body, Res } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUser.dto';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
      // Add the hashed password to createUserDto
      createUserDto.password = hash;
      const createdUser = await this.authService.create(createUserDto);
      // I created a new object because i dont want to send the password to the frontend
      const userResponse = {
        id: createdUser.id,
        fname: createdUser.fname,
        lname: createdUser.lname,
        email: createdUser.email,
        age: createdUser.age,
        createdAt: createdUser.createdAt,
      };
      // Return a JSON response with a success message and the created user data
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
}
