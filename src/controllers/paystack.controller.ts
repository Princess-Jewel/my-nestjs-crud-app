import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import * as https from 'https';
import { AuthGuard } from 'src/guard/auth.guard';
import { Response, Request } from 'express';
import { handleJwtVerificationError } from 'src/errorHandlers/handleJwtVerificationError';
import * as jwt from 'jsonwebtoken';
import { Users } from 'src/schema/users.model';
import { UsersWalletsService } from 'src/services/usersWallets.service';
require('dotenv').config();

const MAX_RETRIES = 3; // Maximum number of retries
const RETRY_INTERVAL = 2 * 60 * 1000; // Retry interval in milliseconds (2 minutes)

const paystackOptions = {
  hostname: 'api.paystack.co',
  port: 443,
  method: '',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
};

@Controller('paystack')
export class PaystackController {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof Users,
    private userWalletService: UsersWalletsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('initializeTransaction/:email/:amount')
  async initializeTransaction(
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<any> {
    try {
      const { email, amount } = req.params;

      const params = JSON.stringify({
        email,
        amount,
      });

      const options = {
        ...paystackOptions,
        path: '/transaction/initialize',
        method: 'POST',
      };

      const initializeTransactionReq = https.request(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            const responseData = JSON.parse(data);
            res.status(200).json(JSON.parse(data));
            // I want the redirection to happen on the frontend, I am sending all of the data to the frontend
            // Redirect the user to the Paystack payment page instead of doing it here.
            // res.redirect(responseData.data.authorization_url);
          } catch (parseError) {
            console.error('Error parsing Paystack response:', parseError);
            res.status(500).json({ error: 'Error parsing Paystack response' });
          }
        });
      });

      initializeTransactionReq.on('error', (error) => {
        console.error('Error initializing transaction:', error);
        res.status(500).json({ error: 'Error initializing transaction' });
      });

      initializeTransactionReq.write(params);
      initializeTransactionReq.end();
    } catch (error) {
      console.error('Error initializing transaction:', error);
      res.status(500).json({ error: 'Error initializing transaction' });
    }
  }

  @UseGuards(AuthGuard)
  @Get('verifyTransaction/:reference')
  async verifyTransaction(
    @Res() res: Response,
    @Req() req: Request,
    retries = 0,
  ): Promise<any> {
    try {
      const options = {
        ...paystackOptions,
        path: `/transaction/verify/${req.params.reference}`,
        method: 'GET',
      };

      const data: string = await new Promise((resolve, reject) => {
        const verifyTransactionReq = https.request(options, (response) => {
          let data: string = '';

          response.on('data', (chunk) => {
            data += chunk;
          });

          response.on('end', () => {
            resolve(data);
          });
        });

        verifyTransactionReq.on('error', (error) => {
          reject(error);
        });

        verifyTransactionReq.end();
      });

      const responseData = JSON.parse(data);

      if (responseData.data.status === 'success') {
        const token = req.headers.authorization;
        const authToken = token.slice(7);

        try {
          const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

          if (typeof decoded === 'string') {
            return handleJwtVerificationError(res, decoded);
          }

          const userId = parseInt(decoded.sub, 10);
          const user = await this.usersRepository.findOne({
            where: { id: userId },
          });

          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }

          // Update user's wallet balance based on the transaction amount
          const updatedWalletBalance =
            await this.userWalletService.updateBalance(
              user.id,
              responseData.data.amount,
              'credit',
            );
          res.status(200).json({
            message: 'Wallet balance updated successfully',
            userBalance: updatedWalletBalance,
          });
        } catch (jwtError) {
          return handleJwtVerificationError(res, jwtError);
        }
      } else {
        if (retries < MAX_RETRIES) {
          console.log(
            `Retry attempt ${
              retries + 1
            }: Transaction verification failed. Retrying in ${
              RETRY_INTERVAL / 1000
            } seconds...`,
          );

          // Retry after a specified interval
          setTimeout(() => {
            this.verifyTransaction(res, req, retries + 1);
          }, RETRY_INTERVAL);
        } else {
          console.log(
            `Max retries reached. Transaction verification failed after ${retries} attempts.`,
          );
          res
            .status(400)
            .json({ error: 'Transaction verification failed after retries' });
        }
      }
    } catch (error) {
      console.error('Error verifying transaction:', error);
      res.status(500).json({ error: 'Error verifying transaction' });
    }
  }
}
