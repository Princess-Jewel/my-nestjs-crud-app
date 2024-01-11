import { Controller, Post, Req, Res } from '@nestjs/common';
import * as crypto from 'crypto';
import { Response, Request } from 'express';
require('dotenv').config();

@Controller('webhook')
export class PaystackWebhookController {
  @Post()
  handleWebhook(@Res() res: Response, @Req() req: Request) {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    
    if (hash === req.headers['x-paystack-signature']) {
      const event = req.body;

      console.log(event)
      console.log(req.body)
      // Process the event here
      
      res.sendStatus(200);
    } else {
      res.sendStatus(403); // Forbidden if the signature doesn't match
    }
  }
}
