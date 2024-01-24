import {
  Body,
  Controller,
  // Inject,
  Post,
  Req,
  Res,
  // UseGuards,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { Response, Request } from 'express';
// import { handleJwtVerificationError } from 'src/errorHandlers/handleJwtVerificationError';
// import { Users } from 'src/schema/users.model';
// import { UsersWalletsService } from 'src/services/usersWallets.service';
// import * as jwt from 'jsonwebtoken';
// import { AuthGuard } from 'src/guard/auth.guard';
import { UsersWallets } from 'src/schema/usersWallets.model';
import { UpdateUsersWalletDtoWithoutId } from 'src/dto/updateUsersWallet.dto';
import { PaymentReceiptService } from 'src/services/paymentReceipt.service';
require('dotenv').config();

@Controller('webhook')
export class PaystackWebhookController {
  constructor(
    private paymentReceiptService: PaymentReceiptService, // @Inject('USERS_REPOSITORY')
  ) // private usersRepository: typeof Users,
  // private userWalletService: UsersWalletsService,
  {}

  @Post()
  async handleWebhook(
    @Res() res: Response,
    @Req() req: Request,
    @Body() updateUsersWalletDtoWithoutId: UpdateUsersWalletDtoWithoutId,
  ) {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash === req.headers['x-paystack-signature']) {
      const event = req.body;

      // console.log('THIS IS THE EVENT', event);
      // console.log('THIS IS THE EVENT DATA', event.data);
      // console.log("THIS IS THE CUSTOMER' customer", event.data.customer.id);
      // console.log("THIS IS THE CUSTOMER' EMAIL", event.data.customer.email);
      // console.log('THIS IS THE REFERENCE', event.data.reference);
      // console.log('THIS IS THE CURRENCY', event.data.currency);
      // console.log('THIS IS THE AMOUNT', event.data.amount);

      try {
        // Find the user's wallet using the reference
        const reference = await UsersWallets.findOne({
          where: {
            reference: event.data.reference,
          },
        });

        if (!reference) {
          return res.status(404).json({ error: 'Invalid Transaction' });
        }

        // divide amount by 100 to convert from kobo back to naira before updating database
        const convertedFromKoboToNaira = event.data.amount / 100;

        // Assuming that you want to update the user's wallet balance
        // based on the transaction amount
        // const amount = parseFloat(event.data.amount);
        // const updatedAmount = await this.userWalletService.updateBalance(
        //   event.data.customer.email,
        //   event.data.reference,
        //   event.data.currency,
        //   parseFloat(event.data.amount),
        //   'credit',
        // );

        // Add the reference to updateUsersWalletDto
        // updateUsersWalletDtoWithoutId.reference = event.data.reference;
        updateUsersWalletDtoWithoutId.email = event.data.customer.email;
        updateUsersWalletDtoWithoutId.reference = event.data.reference;
        updateUsersWalletDtoWithoutId.currency = event.data.currency;
        updateUsersWalletDtoWithoutId.amount = convertedFromKoboToNaira;
        updateUsersWalletDtoWithoutId.transactionType = 'credit';

        // Update other details in the user's wallet if needed
        await reference.update(updateUsersWalletDtoWithoutId);

        // Notify the author via email
        await this.paymentReceiptService.paymentReceiptNotification(
          event.data.customer.email,
          convertedFromKoboToNaira,
          event.data.reference,
          event.data.created_at,
          event.data.authorization.bank,
          event.data.authorization.card_type,
          event.data.authorization.last4,
          event.data.currency,
          'credit',
        );

        // Respond with a success message
        return res.status(200).json({
          status: 'Success',
          message: 'Wallet updated successfully',
        });
      } catch (error) {
        console.error('Error updating wallet:', error);
        return res.status(500).json({ error: 'Error updating wallet' });
      }
    } else {
      res.sendStatus(403); // Forbidden if the signature doesn't match
    }
  }
}
