import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import * as https from 'https';
import { AuthGuard } from 'src/guard/auth.guard';
import { Response, Request } from 'express';
require('dotenv').config();

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
  async initializeTransaction(@Res() res: Response, @Req() req: Request,): Promise<any> {
    try {

      const { email, amount } = req.params;

      const params = JSON.stringify({
        email,
        amount,
      });

      const options = {
        ...paystackOptions,
        path: '/transaction/initialize',
        method: 'POST'
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
  async verifyTransaction(@Res() res: Response, @Req() req: Request,): Promise<any> {
    try {
   
      const options = {
        ...paystackOptions,
        path: `/transaction/verify/${req.params.reference}`,
        method: 'GET',
      };

      const data: string = await new Promise((resolve, reject) => {
        const req = https.request(options, (response) => {
          let data: string = '';

          response.on('data', (chunk) => {
            data += chunk;
          });

          response.on('end', () => {
            resolve(data);
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.end();
      });

      res.status(200).json(JSON.parse(data));
      console.log(JSON.parse(data));
    } catch (error) {
      console.error('Error verifying transaction:', error);
      res.status(500).json({ error: 'Error verifying transaction' });
    }
  }
}
