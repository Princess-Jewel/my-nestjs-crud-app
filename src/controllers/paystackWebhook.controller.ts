import {
  Body,
  Controller,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { Response, Request } from 'express';
// import { Transactions } from 'src/schema/transactions.model';
import { UpdateUsersWalletDtoWithoutId } from 'src/dto/updateUsersWallet.dto';
import { PaymentReceiptService } from 'src/services/paymentReceipt.service';
import { formatDateToDayMonthYear } from 'src/utils/formatDate.utils';
import { addCommasToNumber } from 'src/utils/addCommasToNumber.utils';
import { Transactions } from 'src/schema/transactions.model';
require('dotenv').config();

@Controller('webhook')
export class PaystackWebhookController {
  constructor(
    private paymentReceiptService: PaymentReceiptService, 
 
  ) 
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

      try {
        // Find the user's wallet using the reference
        const reference = await Transactions.findOne({
          where: {
            reference: event.data.reference,
          },
        });

        if (!reference) {
          return res.status(404).json({ error: 'Invalid Transaction' });
        }

        // divide amount by 100 to convert from kobo back to naira before updating database
        const convertedFromKoboToNaira = event.data.amount / 100;

        // add comma(s) to the convertedFromKoboToNaira
        const addedCommaToAmount = addCommasToNumber(convertedFromKoboToNaira);

        // convert created_at to day,month and year format
        const formattedDate = formatDateToDayMonthYear(event.data.created_at);

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
          addedCommaToAmount,
          event.data.reference,
          formattedDate,
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
