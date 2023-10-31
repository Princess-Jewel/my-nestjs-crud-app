import { Controller, Post, Body, Res } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUser.dto';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const createdUser = await this.authService.create(createUserDto);
      // Return a JSON response with a success message and the created user data
      return res.status(201).json({
        status: 'Success',
        message: 'User created successfully',
        user: createdUser,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      // Return an error response with an error message
      return res.status(500).json({ message: 'User creation failed', error: error.message });
    }
  }
}
