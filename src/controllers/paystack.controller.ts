import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import * as https from 'https';
import { AuthGuard } from 'src/guard/auth.guard';
import { Response, Request } from 'express';
require('dotenv').config();

const MAX_RETRIES = 3; // Maximum number of retries
const RETRY_INTERVAL = 1 * 60 * 1000; // Retry interval in milliseconds (2 minutes)

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
  constructor() {}

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
          res.status(200).json(JSON.parse(data));
        });
      });

      initializeTransactionReq.on('error', (error) => {
        console.error(error);
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
      console.log('responseData', responseData);
      if (responseData.data.status === 'success') {
        console.log('TRANSACTION IS A SUCCESSS');
        // Update user's wallet balance based on the transaction amount
        // You need to implement your wallet update logic here
        // Example: userWalletService.updateBalance(userId, amount);

        res.status(200).json({ message: 'Transaction verified successfully' });
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
