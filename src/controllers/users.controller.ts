import { Controller, Get, Post, Res } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { Response } from 'express';
// import { AuthService } from './auth.service';

// @Controller('users')
// export class UsersController {
//   constructor(private usersService: UsersService) {}
//   @Get()
//   findAllUsers(){
//     return this.usersService.getAllUsers()
//   }

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
   // GET /users
  @Get()
  async findAllUsers(@Res() res: Response) {
    const users = await this.usersService.getAllUsers();
    if (users) {
      return res.status(200).json({ message: 'Success', data: users });
    } else {
      return res.status(404).json({ message: 'Not found' });
    }
  }

}
