import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(AuthGuard)
  // GET /users
  @Get()
  async findAllUsers(@Res() res: Response) {
    const users = await this.usersService.findAll();
    if (users) {
      // Create a new array of user objects without the password included
      const formattedUsers = users.map(user => {
        const { id, email, fname, lname, age, createdAt, updatedAt } = user;
        return { id, email, fname, lname, age, createdAt, updatedAt };
      });
  
      return res.status(200).json({ message: 'Success', data: formattedUsers });
    } else {
      return res.status(404).json({ message: 'Not found' });
    }
  } 
}
