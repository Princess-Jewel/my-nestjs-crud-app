import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
  NotFoundException,
  UnauthorizedException,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateUserDto } from 'src/dto/createUser.dto';
import * as jwt from 'jsonwebtoken';
import { Users } from 'src/schema/users.model';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from 'src/dto/updatePassword.dto';

import {
  AnyFilesInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express/multer';
import { UploadAvatarDto } from 'src/dto/uploadAvatar.dto';
import { uploadStream } from 'src/helper/uploadStream';
import { handleJwtVerificationError } from 'src/errorHandlers/handleJwtVerificationError';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof Users,
  ) {}

  @UseGuards(AuthGuard)
  // GET /users
  @Get()
  async findAllUsers(@Res() res: Response) {
    const users = await this.usersService.findAll();
    if (users) {
      // Create a new array of user objects without the password included
      const formattedUsers = users.map((user) => {
        const { id, email, fname, lname, age, createdAt, updatedAt } = user;
        return { id, email, fname, lname, age, createdAt, updatedAt };
      });

      return res.status(200).json({ message: 'Success', data: formattedUsers });
    } else {
      return res.status(404).json({ message: 'Not found' });
    }
  }

  // UPDATE USERNAME
  @UseGuards(AuthGuard)
  @Put('update/username')
  async updateUserName(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
    @Req()
    req: Request,
  ) {
    try {
      // Extract the Bearer token from the Authorization header
      const token = req.headers.authorization;

      // Check if the token exists and starts with 'Bearer '
      if (token && token.startsWith('Bearer ')) {
        // Remove 'Bearer ' to get just the token
        const authToken = token.slice(7);

        // Verify and decode the JWT
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

        // Handle JWT verification errors
        if (typeof decoded === 'string') {
          return handleJwtVerificationError(res, decoded);
        }
        const id = parseInt(decoded.sub, 10); // User ID from JWT. I turned it to an integer to avoid errors

        // Find the user by userId
        const user = await this.usersRepository.findOne({ where: { id } });

        // // Check if the user doesn't exist
        if (!user) {
          throw new NotFoundException('User Not Found');
        }

        // Check if the id belongs to the current user
        if (user.id !== id) {
          throw new UnauthorizedException('Unauthorized');
        }

        user.fname = createUserDto.fname;

        // Update the user with the new fname
        const updatedUserDetails = await user.update(createUserDto);

        // I created a new object because i dont want to send the password to the frontend
        const updatedUserName = {
          id: updatedUserDetails.id,
          fname: updatedUserDetails.fname,
          lname: updatedUserDetails.lname,
          email: updatedUserDetails.email,
          age: updatedUserDetails.age,
          createdAt: updatedUserDetails.createdAt,
        };

        // Respond with a success message
        return res.status(200).json({
          status: 'Success',
          message: 'User name updated successfully',
          user: updatedUserName,
        });
      } else {
        return res.status(401).json({
          status: 'Error',
          message: 'Unauthorized to update username',
        });
      }
    } catch (error) {
      // Handle different exception types and provide appropriate responses
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        res
          .status(error.getStatus())
          .json({ status: 'error', error: error.message });
      } else {
        res
          .status(500)
          .json({ status: 'error', error: 'Internal server error' });
      }
    }
  }

  // UPDATE/CHANGE USER PASSWORD
  @UseGuards(AuthGuard)
  @Put('update/password')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res() res: Response,
  ) {
    try {
      // first check if user exists in the database
      const userExists = await this.usersService.findOne(
        updatePasswordDto.email,
      );

      if (!userExists) {
        return res.status(401).json({
          status: 'Error',
          message: 'User does not exist.',
        });
      }

      if (
        userExists &&
        (await bcrypt.compare(updatePasswordDto.password, userExists.password))
      ) {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(
          updatePasswordDto.newPassword,
          saltOrRounds,
        );

        // Add the hashed password to updatePasswordDto
        updatePasswordDto.password = hash;

        // Update the user with the new fname
        await userExists.update(updatePasswordDto);

        // // Respond with a success message
        return res.status(200).json({
          status: 'Success',
          message: 'Password updated successfully',
        });
      } else {
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (error) {
      // Handle different exception types and provide appropriate responses
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        res
          .status(error.getStatus())
          .json({ status: 'error', error: error.message });
      } else {
        res
          .status(500)
          .json({ status: 'error', error: 'Internal server error' });
      }
    }
  }

  // UPLOAD PROFILE PICTURE
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  @Post('upload/images')
  async uploadImage(
    @UploadedFiles() file: Array<Express.Multer.File>,
    @Body() uploadAvatarDto: UploadAvatarDto,
    @Res() res: Response,
    @Req()
    req: Request,
  ) {
    try {
      const token = req.headers.authorization;

      if (token && token.startsWith('Bearer ')) {
        const authToken = token.slice(7);

        // Verify and decode the JWT
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        if (typeof decoded === 'object' && decoded.hasOwnProperty('email')) {
          const email = decoded.email;
          // Find the user by user email
          const user = await this.usersRepository.findOne({ where: { email } });

          // // Check if the user doesn't exist
          if (!user) {
            throw new NotFoundException('User Not Found');
          }

          // Check if the userEmail belongs to the current user
          if (user.email !== email) {
            throw new UnauthorizedException('Unauthorized');
          }

          const result: any = await uploadStream(file[0].buffer);
          // Add the uploaded avatar url to the createUserDto
          uploadAvatarDto.avatar = result.url;

          // Update the user avatar
          const updatedAvatar = await user.update(uploadAvatarDto);
          // I created a new object because i dont want to send the password to the frontend
          const updatedUserAvatar = {
            id: updatedAvatar.id,
            fname: updatedAvatar.fname,
            lname: updatedAvatar.lname,
            email: updatedAvatar.email,
            age: updatedAvatar.age,
            avatar: updatedAvatar.avatar,
            createdAt: updatedAvatar.createdAt,
            updatedAt: updatedAvatar.updatedAt,
          };
          // Respond with a success message
          return res.status(200).json({
            status: 'Success',
            message: 'Profile Picture updated successfully',
            data: updatedUserAvatar,
          });
        } else {
          res
            .status(500)
            .json({
              status: 'error',
              error: 'Invalid or missing email in decoded JWT payload',
            });
        }
      }
    } catch (error) {
      res.status(500).json({ status: 'error', error: error });
    }
  }
}




